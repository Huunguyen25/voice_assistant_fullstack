import eel
from gtts import gTTS
from io import BytesIO
from pydub import AudioSegment
import pygame
import speech_recognition as sr
from engine.helper import extract_with_regex
import pyautogui as autoui


@eel.expose
def speak(text):
    tempo = 1.2
    volume_reduction_db = -10

    tts = gTTS(text=str(text), lang="en", slow=False)
    wav_fp = BytesIO()
    tts.write_to_fp(wav_fp)

    wav_fp.seek(0)
    audio = AudioSegment.from_file(wav_fp, format="mp3").set_frame_rate(44100)
    audio = audio.speedup(playback_speed=tempo)
    audio = audio + volume_reduction_db

    final_fp = BytesIO()
    audio.export(final_fp, format="wav")
    final_fp.seek(0)

    pygame.init()
    pygame.mixer.init()
    pygame.mixer.music.load(final_fp, "wav")
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
    try:
        if "open" in query:
            from engine.features import open_command

            open_command(query)
        elif "play" in query:
            query = extract_with_regex(query)
            from engine.features import play_youtube

            play_youtube(query)
        else:
            print("Command not recognized")
    except Exception as e:
        print(f"An error occurred: {e}")
        eel.showHood()
    eel.showHood()


@eel.expose
def all_command_text(message):
    query = message
    try:
        if "open" in query:
            from engine.features import open_command

            open_command(query)
        elif "play" in query:
            query = extract_with_regex(query)
            from engine.features import play_youtube

            play_youtube(query)
        else:
            from engine.ai import ai_response

            response = ai_response(query)
            print(response)
            isAi = True
            eel.createMessage(response, isAi)
    except Exception as e:
        print(f"An error occurred: {e}")
        eel.showHood()
    eel.showHood()
