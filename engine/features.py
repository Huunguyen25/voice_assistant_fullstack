import webbrowser
from playsound import playsound
import eel
import os
from engine.command import *
import pywhatkit as kit
import platform
import subprocess
import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

command_mapping = {
    'calculator': 'calc',
    'notepad': 'notepad',
    'paint': 'mspaint',
    'file explorer': 'explorer',
    'explorer': 'explorer',
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
            cursor.execute('SELECT path FROM sys_command WHERE name IN (?)', (app_name,))
            results = cursor.fetchall()
            if len(results) != 0:
                speak("Opening " + query)
                platform_open(results[0][0])
                
            # if not found in sys_command table, search in web_command table
            elif len(results) == 0:
                cursor.execute('SELECT url FROM web_command WHERE name IN (?)', (app_name,))
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
        if platform.system() == 'Darwin':
            subprocess.call((f'open -a "{query}"'))
        elif platform.system() == 'Windows':
            try:
                query = query.lower().strip()
                mapped_command = command_mapping.get(query, query)
                os.system(f'start {mapped_command}')
            except:
                os.system(f'start {query}')

def play_youtube(query):
    if query != None:
        speak("Playing " + query)
        kit.playonyt(query)
