import os

os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = "1"
import multiprocessing
import tempfile

HOTWORD_FLAG_FILE = os.path.join(tempfile.gettempdir(), "voice_assistant_hotword.flag")


def start_core():
    print("Process 1 is running.")
    from main import start_app

    start_app()


def listenHotword():
    print("Process 2 is running.")
    from engine.features import hotword_monitor

    hotword_monitor(HOTWORD_FLAG_FILE)


if __name__ == "__main__":
    if os.path.exists(HOTWORD_FLAG_FILE):
        os.remove(HOTWORD_FLAG_FILE)

    p1 = multiprocessing.Process(target=start_core)
    p2 = multiprocessing.Process(target=listenHotword)

    p1.start()
    p2.start()

    p1.join()

    if p2.is_alive():
        p2.terminate()
        p2.join()

    if os.path.exists(HOTWORD_FLAG_FILE):
        os.remove(HOTWORD_FLAG_FILE)

    print("system stop")
