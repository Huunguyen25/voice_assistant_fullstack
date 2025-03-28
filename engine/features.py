import struct
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
    try:
        activationSound = "www/audio/recording-on.mp3"
        playsound(activationSound)
        return True
    except Exception as e:
        print(f"Error playing activation sound: {e}")
        return False


@eel.expose
def playDeactivationSound():
    try:
        deactivationSound = "www/audio/recording-off.mp3"
        playsound(deactivationSound)
        return True
    except Exception as e:
        print(f"Error playing deactivation sound: {e}")
        return False


def open_command(query):
    query = query.replace("open", "").lower()
    app_name = query.strip()
    if app_name != "":
        try:
            # first search in sys_command table
            cursor.execute("SELECT path FROM sys_command WHERE name = ?", (app_name,))
            results = cursor.fetchall()
            # if found in sys_command table, open the app
            if len(results) != 0:
                speak("Opening " + app_name)
                platform_open(results[0][0])
            # if not found in sys_command table, search in web_command table
            else:
                cursor.execute(
                    "SELECT url FROM web_command WHERE name = ?", (app_name,)
                )
                results = cursor.fetchall()
                # if found in web_command table, open the url in browser
                if len(results) != 0:
                    speak("Opening " + app_name)
                    platform_open(results[0][0])
                else:
                    try:

                        speak("Opening " + app_name)
                        platform_open(app_name)
                    except Exception as e:
                        speak("Sorry, I couldn't find " + app_name)
                        print(f"ERROR: {e}")
        except Exception as e:
            print("An error occurred:", e)
            speak("Sorry, something went wrong")
            eel.showHood()
    else:
        eel.showHood()


def platform_open(query):
    if query != "":
        if platform.system() == "Darwin":
            if "." in query and " " not in query:
                url = (
                    query
                    if query.startswith(("http://", "https://"))
                    else f"https://{query}"
                )
                subprocess.call(["open", url])
            else:
                subprocess.call(["open", "-a", query])
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


# New function that uses file-based communication
def hotword_monitor(flag_file):
    porcupine = None
    paud = None
    audio_stream = None
    
    access_key = os.getenv("PICOVOICE_ACCESS_KEY")
    try:
        if not access_key:
            porcupine = pvporcupine.create(
                keywords=["hey google"],
            )
            
        else:
            porcupine = pvporcupine.create(
                access_key=access_key,
                keywords=["hey google"],
            )
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

            if keyword_index >= 0:
                print("Hotword detected! Creating flag file.")
                # modifying a .flag file that main thread will detect if changed.
                with open(flag_file, "w") as f:
                    f.write(str(time.time()))
                time.sleep(2)

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
