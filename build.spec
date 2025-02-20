# -*- mode: python ; coding: utf-8 -*-
import sys
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

# Collect all necessary data files
datas = [
    ('www', 'www'),  # Include the entire www directory
    ('engine', 'engine'),  # Include the engine directory
    ('database.db', '.'),  # Include the database file
]

# Add platform-specific files
if sys.platform == 'darwin':  # macOS
    datas += [
        # Add any macOS specific files here
    ]
elif sys.platform == 'win32':  # Windows
    datas += [
        # Add any Windows specific files here
    ]

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=['engineio.async_drivers.threading', 'eel.browsers'],
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
    name='CapyChat',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='www/assets/img/icon/favicon.ico'
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='CapyChat',
)

# macOS specific
if sys.platform == 'darwin':
    app = BUNDLE(
        coll,
        name='CapyChat.app',
        icon='www/assets/img/icon/favicon.ico',
        bundle_identifier='com.capychat.app',
        info_plist={
            'NSHighResolutionCapable': 'True',
            'LSBackgroundOnly': 'False',
            'NSRequiresAquaSystemAppearance': 'False',
        },
    )
