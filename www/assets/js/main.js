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
    $("#microphone-btn").click(function() {
        const $micBtn = $(this);
        resetToDefaultMessage();
        eel.playActivationSound()();
        $micBtn.prop('disabled', true);
        eel.all_command()();
        capyMessage.prop('hidden', false);
        capyMessage.textillate('in');
    });
});

