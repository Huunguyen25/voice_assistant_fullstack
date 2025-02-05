$(document).ready(function () {
    const capyMessage = $(".capy-message");
    eel.expose(display_message)

    function display_message(message) {
        // Reset to the default message each time before displaying a new one
        $(".capy-message .texts .current").text(message || "Hi, I'm Capy. How can I help you today?");
        $(".capy-message > span").attr('aria-label', message || "Hi, I'm Capy. How can I help you today?");
        
        // Remove existing textillate data and spans
        capyMessage.removeData('textillate');
        capyMessage.find('span[aria-label]').remove();

        // Initialize textillate with new settings
        capyMessage.textillate({
            selector: '.texts',
            loop: false,
            minDisplayTime: 2000,
            initialDelay: 0,
            autoStart: true,
            in: {
                effect: 'fadeInUp',
                delayScale: 1.5,
                delay: 25,
                sync: true,
                shuffle: false
            },
            out: {
                effect: 'fadeOutDown',
                delayScale: 1.5,
                delay: 25,
                sync: true,
                shuffle: false,
                reverse: true
            }
        });

        capyMessage.textillate('start');
    }

    eel.expose(showHood)
    function showHood() {
        $(".capy-message").textillate('out');
        setTimeout(() => {
            $(".capy-message").prop('hidden', true);
        }, 1000);
        $(".card").removeClass('shrink');
        $(".messages-container").css('display', 'block');
        $(".settings").css('display', 'flex');
        $("#dot-animation").removeClass('show');
        $(".voice-assisting-overlay").removeClass('show');
    }
});
