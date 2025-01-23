$(document).ready(function() {
    const capyMessage = $(".capy-message");
    const DEFAULT_MESSAGE = "Hi, I'm Capy. How can I help you today?";

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

    function resetToDefaultMessage() {
        $(".capy-message .texts .current").text(DEFAULT_MESSAGE);
        $(".capy-message > span").attr('aria-label', DEFAULT_MESSAGE);
        capyMessage.removeData('textillate');
        capyMessage.find('span[aria-label]').remove();
        initTextillate();
    }

    $(document).on('click', '.mic-wrapper, .mic-stop', function() {
        const micButton = $(this);
        if (micButton.hasClass('mic-stop')) {
            resetToDefaultMessage(); // Reset message on mic stop
            eel.speak("How can I help?")();
            setTimeout(() => {
                eel.start_command()();
            }, 1000);
            setTimeout(() => {
                eel.playActivationSound();
                capyMessage.prop('hidden', false);
                capyMessage.textillate('in');
            }, 0);
        } else if (micButton.hasClass('mic-wrapper')) {
            eel.stop_command()();
            eel.playDeactivationSound();
            capyMessage.textillate('out');
            setTimeout(() => {
                capyMessage.prop('hidden', true);
                resetToDefaultMessage(); // Reset message on mic start
            }, 1500);
        }
    });
});

