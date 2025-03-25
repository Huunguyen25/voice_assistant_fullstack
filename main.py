import eel
import sys
import os
import platform
import sqlite3
import time
import threading
import tempfile
from engine.db import create_tables

from engine.features import *
from engine.command import *

eel.init("www")

conn = sqlite3.connect("database.db")
create_tables(conn)

# File path for hotword detection flag
HOTWORD_FLAG_FILE = os.path.join(tempfile.gettempdir(), "voice_assistant_hotword.flag")


def check_hotword_flag():
    "Monitor the hotword flag file and trigger recording mode when detected"
    last_check_time = 0

    while True:
        try:
            if os.path.exists(HOTWORD_FLAG_FILE):
                mod_time = os.path.getmtime(HOTWORD_FLAG_FILE)
                # first condition checks if the mod time is new than last check
                # second checks that if that modification is within the first 5 seconds.
                if mod_time > last_check_time and time.time() - mod_time < 5:
                    print("Hotword flag file detected, triggering recording mode")
                    last_check_time = mod_time
                    eel.recording_mode()

            time.sleep(0.5)  # Check every half second
        except Exception as e:
            print(f"Error checking hotword flag: {e}")
            time.sleep(1)  # Wait longer if there's an error


def start_app():
    # Start flag file monitoring in a background thread
    flag_monitor = threading.Thread(target=check_hotword_flag, daemon=True)
    flag_monitor.start()

    try:
        if sys.platform in ["win32", "win64"]:
            eel.start("index.html", size=(940, 560), port=8080, mode="chrome")
        else:
            eel.start("index.html", size=(940, 560), port=8080, mode="default")
    except (SystemExit, KeyboardInterrupt):
        pass


if __name__ == "__main__":
    print("Starting Voice Assistant...")
    start_app()
