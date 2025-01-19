// $(document).ready(function () {
//     const capyMessage = $(".capy-message");
//     eel.expose(DisplayMessage)
//     function DisplayMessage(message) {
//         // Update the hidden text list first
//         $(".capy-message .texts .current").text(message);
        
//         // Remove existing textillate data and spans
//         capyMessage.removeData('textillate');
//         capyMessage.find('span[aria-label]').remove();
        
//         // Initialize textillate with new settings
//         capyMessage.textillate({
//             selector: '.texts',
//             loop: false,
//             minDisplayTime: 2000,
//             initialDelay: 0,
//             autoStart: true,
//             in: {
//                 effect: 'fadeInUp',
//                 delayScale: 1.5,
//                 delay: 25,
//                 sync: true,
//                 shuffle: false
//             },
//             out: {
//                 effect: 'fadeOutDown',
//                 delayScale: 1.5,
//                 delay: 25,
//                 sync: true,
//                 shuffle: false,
//                 reverse: true
//             }
//         });
        
//         // Set the message and start animation
//         $(".capy-message > span").attr('aria-label', message);
//         capyMessage.textillate('start');
//     }

//     eel.expose(showHood)
//     function showHood() {
//         if (typeof window.stopRecording === 'function') {
//             window.stopRecording();
//         }
//         $(".capy-message").textillate('out');
//         setTimeout(() => {
//             $(".capy-message").prop('hidden', true);
//         }, 1000);
//     }
// });

$(document).ready(function () {
    const capyMessage = $(".capy-message");
    eel.expose(DisplayMessage)

    function DisplayMessage(message) {
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
        if (typeof window.stopRecording === 'function') {
            window.stopRecording();
        }
        $(".capy-message").textillate('out');
        setTimeout(() => {
            $(".capy-message").prop('hidden', true);
        }, 1000);
    }
});
