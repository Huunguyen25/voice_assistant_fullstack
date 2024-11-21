import os
import eel
import threading

# Initialize the eel application
eel.init("www")

# Start the server in a separate thread to ensure the server is ready before launching Chromium
def start_server():
    eel.start('index.html', mode=None, host='localhost', block=True, size=(940, 480))

thread = threading.Thread(target=start_server, daemon=True)
thread.start()

# Launch Chromium in app mode
os.system('chromium --app="http://localhost:8000/index.html" --enable-features=WebAppEnableResizableWindow')
