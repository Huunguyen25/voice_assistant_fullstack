import os
import eel

from engine.features import *
from engine.command import *

eel.init("www")
# os.system("open -a 'Chromium' http://localhost:8080")
eel.start("index.html", size=(940, 560), port=8080)
