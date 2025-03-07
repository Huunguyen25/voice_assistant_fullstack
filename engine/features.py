import struct
import webbrowser
from playsound import playsound
import eel
import os

import pyaudio
from engine.command import *
import pywhatkit as kit
import platform
import subprocess
import sqlite3
import pvporcupine
import time

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

command_mapping = {
    "calculator": "calc",
    "notepad": "notepad",
    "paint": "mspaint",
    "file explorer": "explorer",
    "explorer": "explorer",
}


@eel.expose
def playActivationSound():
    activationSound = "www/audio/recording-on.mp3"
    playsound(activationSound)


@eel.expose
def playDeactivationSound():
    deactivationSound = "www/audio/recording-off.mp3"
    playsound(deactivationSound)


def open_command(query):
    query = query.replace("open", "").lower()
    app_name = query.strip()
    if app_name != "":
        try:
            # first search in sys_command table
            cursor.execute(
                "SELECT api FROM sys_command WHERE name IN (?)", (app_name,)
            )
            results = cursor.fetchall()
            if len(results) != 0:
                speak("Opening " + query)
                platform_open(results[0][0])
            # if not found in sys_command table, search in web_command table
            elif len(results) == 0:
                cursor.execute(
                    "SELECT url FROM web_command WHERE name IN (?)", (app_name,)
                )
                results = cursor.fetchall()

                # if found in web_command table, open the url in browser
                if len(results) != 0:
                    speak("Opening " + query)
                    webbrowser.open(results[0][0])
                else:
                    speak("Opening " + query)
                    try:
                        platform_open(query)
                    except:
                        speak("Not found")
                        eel.showHood()
        except:
            speak("Something went wrong")
            eel.showHood()
    eel.showHood()


def platform_open(query):
    if query != "":
        if platform.system() == "Darwin":
            subprocess.call((f'open -a "{query}"'))
        elif platform.system() == "Windows":
            try:
                query = query.lower().strip()
                mapped_command = command_mapping.get(query, query)
                result = os.system(f"start {mapped_command}")
                if result != 0:
                    eel.showHood()
            except:
                speak("Nothing found")
                eel.showHood()


def play_youtube(query):
    if query != None:
        speak("Playing " + query)
        kit.playonyt(query)


def hotword():
    porcupine = None
    paud = None
    audio_stream = None
    try:
        # pre-trained keywords
        porcupine = pvporcupine.create(keywords=["hey google"])
        paud = pyaudio.PyAudio()
        audio_stream = paud.open(
            rate=porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=porcupine.frame_length,
        )
        while True:
            keyword_audio = audio_stream.read(
                porcupine.frame_length, exception_on_overflow=False
            )
            keyword = struct.unpack_from("h" * porcupine.frame_length, keyword_audio)
            keyword_index = porcupine.process(keyword)

            # checking if any keyword detected
            if keyword_index >= 0:
                print("Hotword detected!")
                import pyautogui as autogui

                autogui.keyDown("win")
                autogui.press("j")
                time.sleep(2)
                autogui.keyUp("win")
            time.sleep(0.01)

    except Exception as e:
        print("An error occurred:", e)
    finally:
        if porcupine is not None:
            porcupine.delete()
        if audio_stream is not None:
            audio_stream.close()
        if paud is not None:
            paud.terminate()
