$(document).ready(function () {
    const capyMessage = $(".capy-message");
    eel.expose(DisplayMessage)
    function DisplayMessage(message) {
        $(".capy-message li:first").text(message);
        $(".capy-message").textillate('start');
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