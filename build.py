#!/usr/bin/env python3
import os
import sys
import subprocess
import platform


def check_www_directory():
    """Check if the www directory exists"""
    if os.path.exists("www"):
        print("Found existing 'www' directory.")
    else:
        print(
            "WARNING: 'www' directory not found. Your application may not work as expected."
        )
        print(
            "Please ensure your web files are in a directory called 'www' at the root of your project."
        )


def main():
    # Create the dist and build directories if they don't exist
    for dir_path in ["dist", "build"]:
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)

    # Check for www directory
    check_www_directory()

    print(f"Building Voice Assistant for {platform.system()}...")

    # Run PyInstaller with the spec file
    cmd = ["pyinstaller", "--clean", "voice_assistant.spec"]

    try:
        subprocess.run(cmd, check=True)
        print("\nBuild completed successfully!")

        # Print the location of the executable
        if platform.system() == "Darwin":  # macOS
            print("Executable created at: dist/VoiceAssistant.app")
        elif platform.system() == "Windows":
            print("Executable created at: dist/VoiceAssistant/VoiceAssistant.exe")
        else:  # Linux
            print("Executable created at: dist/VoiceAssistant/VoiceAssistant")

    except subprocess.CalledProcessError as e:
        print(f"Build failed with error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
