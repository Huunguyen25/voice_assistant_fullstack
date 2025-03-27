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
        settings: $('.settings-panel'),
        dotAnimation: $('#dot-animation'),
        voiceAssistingOverlay: $('.voice-assisting-overlay'),
        micBtn: $("#microphone-btn"),
        sendBtn: $("#send-btn")
    };

    function resetToDefaultMessage() {
        $(".capy-message .texts .current").text(DEFAULT_MESSAGE);
        $(".capy-message > span").attr('aria-label', DEFAULT_MESSAGE);
        capyMessage.removeData('textillate');
        capyMessage.find('span[aria-label]').remove();
        initTextillate();
    }

    eel.expose(recording_mode)
    function recording_mode() {
        resetToDefaultMessage();

        sidebar_close()
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

    $("#microphone-btn").click(function() {
        recording_mode();
    });
    
    function doc_keyUp(e) {
        if (e.key === 'j' && e.metaKey) {
            console.log("recording mode activating")
            recording_mode();
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);

    $('#chatbox').keyup(function(){
        let message = $('#chatbox').val();
        toggleBtn(message);
    })

    $('#chatbox').keydown(function(e){
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
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
        try {
            createMessage(message, false);
            
            $('#chatbox').val('');
            toggleBtn('');
            
            elements.dotAnimation.addClass('show');
            elements.sendBtn.prop('disabled', true);
            elements.micBtn.prop('disabled', true);

            eel.all_command_text(message)(
                function(response) {
                    elements.dotAnimation.removeClass('show');
                    elements.sendBtn.prop('disabled', false);
                    elements.micBtn.prop('disabled', false);
                },
                function(error) {
                    console.error("Error calling all_command_text:", error);
                    createMessage("Sorry, I encountered an error processing your request.", true);
                    
                    elements.sendBtn.prop('disabled', false);
                    elements.micBtn.prop('disabled', false);
                    elements.dotAnimation.removeClass('show');
                }
            );
            
        } catch(e) {
            console.error("Exception when sending message:", e);
            createMessage("Sorry, there was a problem communicating with the assistant.", true);
            elements.sendBtn.prop('disabled', false);
            elements.dotAnimation.removeClass('show');
        }
    });
    
    eel.expose(createMessage);
    function createMessage(message, isAi) {
        try {
            const messageContainer = $('<div>').addClass(isAi ? 'ai-message-container' : 'user-message-container');
            const messageContent = $('<div>').addClass(isAi ? 'ai-message-content' : 'user-message-content');
            
            if (isAi) {
                let processedMessage = message || "No response";
                
                // Protect LaTeX blocks from Markdown processing
                
                // 1. Save display math blocks
                const displayMathBlocks = [];
                processedMessage = processedMessage.replace(/\\\[(.*?)\\\]/gs, function(match, latex) {
                    displayMathBlocks.push(latex);
                    return `DISPLAY_MATH_${displayMathBlocks.length - 1}`;
                });
                
                // 2. Save inline math blocks
                const inlineMathBlocks = [];
                processedMessage = processedMessage.replace(/\\\((.*?)\\\)/gs, function(match, latex) {
                    inlineMathBlocks.push(latex);
                    return `INLINE_MATH_${inlineMathBlocks.length - 1}`;
                });
                
                // Process text commands
                processedMessage = processedMessage.replace(/\\text\{(.*?)\}/g, '$1');
                
                // Process boxed commands
                processedMessage = processedMessage.replace(/\\boxed\{(.*?)\}/g, function(match, content) {
                    return `$\\boxed{${content}}$`;
                });
                
                // Apply Markdown processing
                let htmlContent = marked.parse(processedMessage);
                
                // Restore LaTeX blocks
                // 1. Restore display math
                displayMathBlocks.forEach((latex, i) => {
                    htmlContent = htmlContent.replace(
                        new RegExp(`DISPLAY_MATH_${i}`, 'g'), 
                        `$$${latex}$$`
                    );
                });
                
                // 2. Restore inline math
                inlineMathBlocks.forEach((latex, i) => {
                    htmlContent = htmlContent.replace(
                        new RegExp(`INLINE_MATH_${i}`, 'g'), 
                        `$${latex}$`
                    );
                });
                
                // Create message element
                const messageText = $('<div>')
                    .addClass('ai-message-text markdown-content math-content')
                    .html(htmlContent);
                
                const messageAvatar = $('<div>').addClass('ai-message-avatar').append(
                    $('<img>').attr('src', 'assets/img/icon/icon.png').attr('alt', 'AI')
                );
                messageContainer.append(messageAvatar);
                messageContent.append(messageText);
            } else {
                const messageText = $('<span>')
                    .addClass('user-message-text')
                    .text(message || "No response");
                messageContent.append(messageText);
            }
            
            messageContainer.append(messageContent);
            $('.messages-list').append(messageContainer);
            
            if (isAi) {
                if (typeof hljs !== 'undefined') {
                    messageContainer.find('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                }
                // Render LaTeX after adding to DOM
                if (typeof MathJax !== 'undefined') {
                    MathJax.typesetPromise([messageContainer[0]]).catch(function(err) {
                        console.error('MathJax error:', err);
                    });
                }
            }
            $('.messages-list').scrollTop($('.messages-list')[0].scrollHeight);
        } catch(e) {
            console.error("Error creating message:", e);
        }
    }
    
    const sidebar_button_open = $("#sidebar-open-button")
    const sidebar_button_close = $("#sidebar-close-button")
    const sidebar = $(".sidebar")
    const sidebar_global_container = $(".sidebar-global-container")

    const setting_button_container = $(".setting-button-container")
    const history_sidebar_container = $(".sidebar-container")

    function sidebar_open(){
        sidebar_global_container.css({"opacity":"1"});
        sidebar_button_open.prop("hidden", true);
        setting_button_container.prop("hidden", false);
        history_sidebar_container.prop("hidden", false);
        sidebar.addClass("open");
    }

    function sidebar_close(){
        sidebar_global_container.css({"opacity":"0"});
        setting_button_container.prop("hidden", true);
        history_sidebar_container.prop("hidden", true);
        setTimeout(function() {
            sidebar_button_open.prop("hidden", false);
        })
        sidebar.removeClass("open");
    }


    sidebar_button_open.click(function(){
        sidebar_open()
    })
    sidebar_button_close.click(function(){
        sidebar_close()
    })
});