from playsound import playsound
import eel
import os
from engine.command import *
import pywhatkit as kit


@eel.expose
def playActivationSound():
    activationSound = "www/audio/recording-on.mp3"
    playsound(activationSound)


@eel.expose
def playDeactivationSound():
    deactivationSound = "www/audio/recording-off.mp3"
    playsound(deactivationSound)


def open_command(query):
    query = query.replace("open ", "").lower()
    if query != "":
        speak("Opening " + query)
        os.system("open -a " + f"'{query}'")
    else:
        speak("Not found")


def play_youtube(query):
    if query != None:
        speak("Playing " + query)
        kit.playonyt(query)
