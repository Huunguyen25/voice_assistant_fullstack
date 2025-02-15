import eel

from engine.features import *
from engine.command import *

eel.init("www")
eel.start("index.html", size=(940, 560), port=8080)
