# -*- mode: python ; coding: utf-8 -*-

import sys
import os
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

# Assuming your main script is named main.py - adjust if different
main_script = 'main.py'

# Collect all necessary data files
datas = []
datas += collect_data_files('pvporcupine')  # for wake word detection
datas += collect_data_files('pywhatkit')    # for additional functionalities

# Use the existing 'www' directory instead of 'web'
if os.path.exists('www'):
    datas += [('www', 'www')]
    print("Found existing 'www' directory for web assets.")
else:
    print("Warning: 'www' directory not found. Make sure it exists for your web interface.")

# Add any other files/folders your app needs
if os.path.exists('resources'):
    datas.append(('resources', 'resources'))

# Hidden imports
hiddenimports = []
hiddenimports += collect_submodules('eel')
hiddenimports += ['pywhatkit', 'playsound', 'gtts', 'pydub', 'pygame']

# Platform-specific adjustments
if sys.platform == 'darwin':  # macOS
    icon = 'icon.icns' if os.path.exists('icon.icns') else None
elif sys.platform == 'win32':  # Windows
    icon = 'icon.ico' if os.path.exists('icon.ico') else None
else:  # Linux
    icon = 'icon.png' if os.path.exists('icon.png') else None

a = Analysis(
    [main_script],
    pathex=[os.path.dirname(os.path.abspath(main_script))],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='VoiceAssistant',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # Change to True if you want to show console
    icon=icon,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='VoiceAssistant',
)

# macOS specific bundle
if sys.platform == 'darwin':
    app = BUNDLE(
        coll,
        name='VoiceAssistant.app',
        icon=icon,
        bundle_identifier='com.voiceassistant.app',
        info_plist={
            'NSPrincipalClass': 'NSApplication',
            'NSAppleScriptEnabled': False,
            'CFBundleDocumentTypes': [],
            'NSMicrophoneUsageDescription': 'This app requires microphone access for voice recognition.',
        },
    )
