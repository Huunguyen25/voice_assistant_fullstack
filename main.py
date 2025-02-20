import eel
import sqlite3

from engine.features import *
from engine.command import *

eel.init("www")
eel.start("index.html", size=(940, 560), port=8080)

from engine.db import create_tables

conn = sqlite3.connect("database.db")
create_tables(conn)
