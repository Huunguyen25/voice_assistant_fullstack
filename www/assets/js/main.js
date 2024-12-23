$(document).ready(function() {
    let isRecording = false;
    let cooldown = false;
    $("#microphone-btn").click(function() {
        if (!cooldown) {
            cooldown = true;
            if (isRecording) {
                eel.playDeactivationSound();
                isRecording = false;
            } else {
                eel.playActivationSound();
                isRecording = true;
            }
            setTimeout(() => cooldown = false, 500);
        }
    });
});
