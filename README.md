# Voice Assistant App

## Overview
This is a cross-platform voice assistant application built with Python and Eel that provides a web-based UI for users to interact via voice or text commands, supports customizable system and web commands, and uses OpenRouter API for AI responses.

## 🚀 Getting Started

#### Installation
```bash
git clone https://github.com/Huunguyen25/voice_assistant_fullstack.git

cd voice_assistant_fullstack/
```
#### Build and Run 
##### For MacOS  
  > ```bash  
  > python3 -m venv env  
  > source env/bin/activate  
  >   
  > python3 install -r requirements.txt  
  >   
  > python3 run.py  
  > ```
##### For Windows  
  > ```bash  
  > python -m venv env  
  > source env/bin/activate  
  >   
  > python install -r windows_requirements.txt  
  >   
  > python run.py  
  > ```

>[!WARNING]
> By default, the app uses `pvporcupine==1.9.5` for Windows, as it doesn’t require an access key. On macOS, this version disables hotword detection without an access key. To enable hotword detection on macOS, visit [picovoice](https://console.picovoice.ai/) and create an access key. Upgrade to `pvporcupine==3.0.5` and add the following line to the bottom of `env/bin/activate` or `.env` file:
> ```bash
> export PICOVOICE_API_KEY="your_api_key_here"
> ```

## 🎸 Usage
#### Openrouter API required to unlock AI conversation
* #### Visit [openrouter](https://openrouter.ai/settings/keys) and create a key
https://github.com/user-attachments/assets/b6615294-5f40-461a-a383-c3ee64bc8e15

### After this you're all set! 🎉

- ### Use the app as you please!🙂
- ### Checkout the setting to add urls to websites or path to executables

> [!NOTE]
> #### MacOS does NOT requires adding system apps path as darwin has an intuitive terminal
> ##### Please suggest any features you would like to add
> ##### If issues/bugs still persists, please post a `New Issue` or even better try fixing yourself :)

  ---
## 📋 ROADMAPS
- [x] Implement AI converstation
- [x] Play on youtube feature
- [x] Convert AI stateless API to stateful
- [ ] Implement chat history
- [ ] Search/Play spotify feature
- [ ] Whatsapp texting Feature
