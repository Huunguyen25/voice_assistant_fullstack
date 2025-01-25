from playsound import playsound
import eel
from engine.config import ASSISTANT_NAME


@eel.expose
def playActivationSound():
    activationSound = "www/audio/recording-on.mp3"
    playsound(activationSound)


@eel.expose
def playDeactivationSound():
    deactivationSound = "www/audio/recording-off.mp3"
    playsound(deactivationSound)


@eel.expose
def openCommand(query):
    query = query.replace("ASSISTANT_NAME", "").strip()
    query = query.replace("open", "").strip()
    query = query.lower()
    if query != "":
        speak("Opening " + query)
        os.system("open " + query)
    else:
        speak("Not found")
