$(document).ready(function() {
    const capyMessage = $(".capy-message");
    const DEFAULT_MESSAGE = "How can I help you today?";

    function initTextillate() {
        capyMessage.textillate({
            loop: false,
            minDisplayTime: 2000,
            initialDelay: 0,
            in: {
                effect: 'fadeInUp',
                delayScale: 1.5,
                delay: 25,
                sync: true,
                shuffle: false,
            },
            out: {
                effect: 'fadeOutDown',
                delayScale: 1.5,
                delay: 25,
                sync: true,
                shuffle: false,
                reverse: true,
            }
        });
    }

    const elements = {
        card: $('.card'),
        messagesContainer: $('.messages-container'),
        settings: $('.settings'),
        dotAnimation: $('#dot-animation'),
        voiceAssistingOverlay: $('.voice-assisting-overlay'),
        micBtn: $("#microphone-btn")
    };

    function resetToDefaultMessage() {
        $(".capy-message .texts .current").text(DEFAULT_MESSAGE);
        $(".capy-message > span").attr('aria-label', DEFAULT_MESSAGE);
        capyMessage.removeData('textillate');
        capyMessage.find('span[aria-label]').remove();
        initTextillate();
    }

    function recording_mode(message) {
        if (message != ""){
            resetToDefaultMessage();
            eel.playActivationSound();
            elements.micBtn.prop('disabled', true);

            eel.speak("How can I help?");
            setTimeout(function() {
                eel.all_command()();
            }, 500);
        
            capyMessage.prop('hidden', false);
            capyMessage.textillate('in');

            elements.card.addClass('shrink');
            elements.messagesContainer.hide();
            elements.settings.hide();
            elements.dotAnimation.addClass('show');
            elements.voiceAssistingOverlay.addClass('show');
        }
    }

    $("#microphone-btn").click(function() {
        recording_mode();
    });
    
    function doc_keyUp(e) {
        if (e.key === 'j' && e.metaKey) {
            recording_mode();
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);

    $('#chatbox').keyup(function(){
        let message = $('#chatbox').val();
        toggleBtn(message);
    })

    // Add Enter key listener to send messages
    $('#chatbox').keydown(function(e){
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault(); // Prevent new line
            if ($('#chatbox').val().trim().length > 0) {
                $('#send-btn').click(); // Trigger send button click
            }
        }
    });

    function toggleBtn(message){
        if (message.length == 0){
            $('#send-btn').prop('hidden', true);
            $('#microphone-btn').prop('hidden', false);
        } else {
            $('#send-btn').prop('hidden', false);
            $('#microphone-btn').prop('hidden', true);
        }
    }

    $('#send-btn').click(function(){
        let message = $('#chatbox').val();
        eel.all_command_text(message)();
        $('#chatbox').val('');
        toggleBtn('');
        isAi = false;
        createMessage(message, isAi);
    });
    
    eel.expose(createMessage);
    function createMessage(message, isAi) {
        const messageContainer = $('<div>').addClass(isAi ? 'ai-message-container' : 'user-message-container');
        const messageContent = $('<div>').addClass(isAi ? 'ai-message-content' : 'user-message-content');
        const messageText = $('<span>').addClass(isAi ? 'ai-message-text' : 'user-message-text').text(message);

        if (isAi) {
            const messageAvatar = $('<div>').addClass('ai-message-avatar').append(
                $('<img>').attr('src', 'assets/img/icon/icon.png').attr('alt', 'AI')
            );
            messageContainer.append(messageAvatar);
        }

        messageContent.append(messageText);
        messageContainer.append(messageContent);
        $('.messages-list').append(messageContainer);
        $('.messages-list').scrollTop($('.messages-list')[0].scrollHeight);
    }
});