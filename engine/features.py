from playsound import playsound
import eel
import os
from engine.command import *
import pywhatkit as kit
import platform
import subprocess


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
    try:
        if query != "":
            speak("Opening " + query)
            if platform.system() == 'Darwin':
                subprocess.call(('open -a', f"'{query}'"))
            elif platform.system() == 'Windows':
                os.startfile(query)
            else:
                speak("Not found")
    except Exception as e:
        eel.showHood()
    eel.showHood()
        


def play_youtube(query):
    if query != None:
        speak("Playing " + query)
        kit.playonyt(query)
