import eel
import sqlite3
from engine.db import create_tables

from engine.features import *
from engine.command import *

# Initialize eel with your web files directory
eel.init("www")

# Create database and tables
conn = sqlite3.connect("database.db")
create_tables(conn)

# Start the application
eel.start("index.html", size=(940, 560), port=8080)
