import os
import eel

eel.init("www")
os.system("open -a 'Microsoft Edge' http://localhost:8080")
eel.start("index.html", size=(940, 560), port=8080)
