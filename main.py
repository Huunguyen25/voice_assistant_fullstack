import eel
import sys
import os
import platform
import sqlite3
from engine.db import create_tables

from engine.features import *
from engine.command import *

eel.init("www")

conn = sqlite3.connect("database.db")
create_tables(conn)


def start_app():
    try:
        # Start Eel with your HTML file
        # Use chrome-app mode if available, otherwise use the default browser
        if sys.platform in ["win32", "win64"]:
            eel.start("index.html", size=(940, 560), port=8080)
        else:
            # On macOS and Linux, we'll use the default system browser
            eel.start("index.html", size=(940, 560), port=8080)
    except (SystemExit, KeyboardInterrupt):
        # Handle clean exit
        pass


if __name__ == "__main__":
    print("Starting Voice Assistant...")
    start_app()
