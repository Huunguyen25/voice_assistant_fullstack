$(document).ready(function() {
    const capyMessage = $(".capy-message");
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
    
    $(document).on('click', '.mic-wrapper, .mic-stop', function() {
        const micButton = $(this);
        if (micButton.hasClass('mic-stop')) {
            eel.start_command()();
            setTimeout(() => {
                eel.playActivationSound();
                capyMessage.prop('hidden', false);
                retextillate(capyMessage, 'in');
            }, 0);
        } else if (micButton.hasClass('mic-wrapper')) {
            eel.stop_command()();
            eel.playDeactivationSound();
            retextillate(capyMessage, 'out');
            setTimeout(() => {
                capyMessage.prop('hidden', true);
            }, 1500);
        }
    });
});
