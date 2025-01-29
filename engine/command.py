import eel
from gtts import gTTS
from io import BytesIO
from pydub import AudioSegment
import pygame
import speech_recognition as sr
import pyaudio
import numpy as np
import threading
import time
import queue


@eel.expose
def speak(text):
    tempo = 1.2
    mp3_fp = BytesIO()
    tts = gTTS(text=str(text), lang="en", slow=False)
    tts.write_to_fp(mp3_fp)

    mp3_fp.seek(0)
    audio = AudioSegment.from_file(mp3_fp)
    audio = audio.speedup(tempo)

    sped_up_fp = BytesIO()
    audio.export(sped_up_fp, format="mp3")
    sped_up_fp.seek(0)

    pygame.init()
    pygame.mixer.init()
    pygame.mixer.music.load(sped_up_fp, "mp3")
    pygame.mixer.music.play()

    # while pygame.mixer.music.get_busy():
    #     pygame.time.Clock().tick(10)


# Globals to control threads and recording
recording_thread = None
recording_active = threading.Event()

query_result = queue.Queue()


def recording():
    global recording_active
    global query_result

    FORMAT, CHANNELS, RATE = pyaudio.paInt16, 1, 16000
    CHUNK = 1024  # Reduced for faster response
    SILENCE_TIME = 1.5  # Reduced silence time
    SILENCE_CHUNKS = int(SILENCE_TIME * RATE / CHUNK)
    AMBIENT_MULTIPLIER = 1.5  # Threshold multiplier above ambient
    MIN_SPEECH_THRESHOLD = 100  # Minimum threshold regardless of ambient

    try:
        p = pyaudio.PyAudio()
        stream = p.open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            input=True,
            frames_per_buffer=CHUNK,
        )
    except Exception as e:
        print(f"Error initializing audio: {e}")
        if "p" in locals():
            p.terminate()
            eel.showHood()
        return ""

    def calculate_amplitude(audio_data):
        return np.abs(audio_data).mean()

    def transcribe_audio(audio_data):
        recognizer = sr.Recognizer()
        audio = sr.AudioData(audio_data, RATE, p.get_sample_size(FORMAT))
        try:
            return recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            print("Could not understand audio")
            eel.showHood()
            return ""
        except sr.RequestError as e:
            print(f"Request error: {e}")
            eel.showHood()
            return ""

    print("Calibrating ambient noise levels...")
    ambient_levels = []
    for _ in range(10):  # Increased samples for better calibration
        data = stream.read(CHUNK, exception_on_overflow=False)
        audio_data = np.frombuffer(data, dtype=np.int16)
        ambient_levels.append(calculate_amplitude(audio_data))
        time.sleep(0.04)  # Short delay between samples

    average_ambient = np.mean(ambient_levels)
    SPEECH_THRESHOLD = max(MIN_SPEECH_THRESHOLD, average_ambient * AMBIENT_MULTIPLIER)
    print(f"Ambient noise level: {average_ambient:.2f}")
    print(f"Speech threshold set to: {SPEECH_THRESHOLD:.2f}")
    print("Ready for speech...")

    speech_started = False
    consecutive_silence_chunks = 0
    speech_buffer = []

    # Dynamic threshold adjustment variables
    running_amplitude = []
    RUNNING_WINDOW = 10

    # Wait for speech to start
    while recording_active.is_set() and not speech_started:
        data = stream.read(CHUNK, exception_on_overflow=False)
        audio_data = np.frombuffer(data, dtype=np.int16)
        current_amplitude = calculate_amplitude(audio_data)

        # Update running amplitude
        running_amplitude.append(current_amplitude)
        if len(running_amplitude) > RUNNING_WINDOW:
            running_amplitude.pop(0)
            current_threshold = max(
                SPEECH_THRESHOLD, np.mean(running_amplitude) * AMBIENT_MULTIPLIER
            )
        else:
            current_threshold = SPEECH_THRESHOLD

        if current_amplitude > current_threshold:
            print(f"\nSpeech detected! (Amplitude: {current_amplitude:.2f})")
            speech_started = True
            speech_buffer.append(data)

    # Continue recording until silence is detected
    while speech_started and recording_active.is_set():
        data = stream.read(CHUNK, exception_on_overflow=False)
        audio_data = np.frombuffer(data, dtype=np.int16)
        current_amplitude = calculate_amplitude(audio_data)

        # Update running amplitude for dynamic threshold
        running_amplitude.append(current_amplitude)
        if len(running_amplitude) > RUNNING_WINDOW:
            running_amplitude.pop(0)
        current_threshold = max(
            SPEECH_THRESHOLD, np.mean(running_amplitude) * AMBIENT_MULTIPLIER
        )

        if current_amplitude > current_threshold:
            consecutive_silence_chunks = 0
        else:
            consecutive_silence_chunks += 1

        speech_buffer.append(data)

        if consecutive_silence_chunks >= SILENCE_CHUNKS:
            print(f"\nSilence detected (Amplitude: {current_amplitude:.2f})")
            if speech_buffer:
                transcription = transcribe_audio(b"".join(speech_buffer))
                stream.stop_stream()
                stream.close()
                p.terminate()
                print(f"Transcription: {transcription}")
                if transcription != "":
                    eel.DisplayMessage(transcription)
                    query_result.put(transcription)

    stream.stop_stream()
    stream.close()
    p.terminate()
    return


@eel.expose
def start_command():
    global recording_thread, recording_active

    if recording_thread and recording_thread.is_alive():
        print("Recording is already active.")
        return

    recording_active.set()
    recording_thread = threading.Thread(target=recording, daemon=True)
    recording_thread.start()
    print("Recording started.")


@eel.expose
def stop_command():
    global recording_active

    if not recording_active.is_set():
        print("Recording is not active.")
        return

    recording_active.clear()
    if recording_thread:
        recording_thread.join()
    print("Recording stopped.")


@eel.expose
def all_command():
    global query_result

    start_command()
    query = query_result.get()
    if "open" in query:
        openCommand(query)
    else:
        print("No specific command")
