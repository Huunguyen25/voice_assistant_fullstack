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

    function recording_mode() {
        resetToDefaultMessage();
        eel.playActivationSound()();
        elements.micBtn.prop('disabled', true);

        eel.speak("How can I help?")();
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
            recording_mode();
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);
});