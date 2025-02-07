import eel
from gtts import gTTS
from io import BytesIO
from pydub import AudioSegment
import pygame
import speech_recognition as sr
import re


@eel.expose
def speak(text):
    tempo = 1.2
    volume_reduction_db = -17  # Reduce volume by 10 dB
    mp3_fp = BytesIO()
    tts = gTTS(text=str(text), lang="en", slow=False)
    tts.write_to_fp(mp3_fp)

    mp3_fp.seek(0)
    audio = AudioSegment.from_file(mp3_fp)
    audio = audio.speedup(tempo)
    audio = audio + volume_reduction_db  # Apply volume reduction

    sped_up_fp = BytesIO()
    audio.export(sped_up_fp, format="mp3")
    sped_up_fp.seek(0)

    pygame.init()
    pygame.mixer.init()
    pygame.mixer.music.load(sped_up_fp, "mp3")
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)


@eel.expose
def start_recording():
    r = sr.Recognizer()

    with sr.Microphone() as source:
        eel.display_message("Listening...")
        audio = r.listen(source, 10, 6)
        r.pause_threshold = 1
        r.adjust_for_ambient_noise(source)
        # speak and display message here
        try:
            eel.display_message("Recognizing...")
            query = r.recognize_google(audio, language="en-US")
            eel.display_message(query)
        except Exception as e:
            return ""
    return query


@eel.expose
def all_command():
    query = start_recording()
    query = query.lower()
    print(query)
    try:
        if "open" in query:
            query = query.replace("open ", "")
            from engine.features import open_command
            open_command(query)
        elif "play" in query:
            query = extract_with_regex(query)
            from engine.features import play_youtube
            play_youtube(query)
        else:
            print("I don't understand")
    except Exception as e:
        print(f"An error occurred: {e}")
        eel.showHood()
    eel.showHood()


def extract_with_regex(query):
    pattern = r"play\s+(.*?)\s+on\s+youtube"
    match = re.search(pattern, query, re.IGNORECASE)
    return match.group(1) if match else None
