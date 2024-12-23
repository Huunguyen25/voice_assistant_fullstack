// for dynamic resizing of textarea
const textarea = document.querySelector(".chatbox");
const card = document.querySelector(".card");
textarea.addEventListener("input", e => {
    textarea.style.height = "42px";
    card.style.height = "auto";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight}px`;
    card.style.height = `${scHeight}px`;
});

// for opening and closing settings panel
const settingsBtn = document.getElementById("settings-button");
const panel = document.getElementById("settings-panel");
const closePanelBtn = document.getElementById("closePanelBtn");

settingsBtn.addEventListener("click", () => {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
});

closePanelBtn.addEventListener("click", () => {
    panel.style.display = "none";
});


// displaying the different settings sections
const prefSysWebButtons = document.querySelectorAll(".settings-buttons-division-container button");
const menuContainer = document.querySelector(".menu-container");
const settingsSections = document.querySelectorAll(".settings-section");

menuContainer.style.display = "none";
settingsSections.forEach(section => {
    section.style.display = "none";
});

prefSysWebButtons.forEach(button => {
    button.addEventListener("click", () => {
        menuContainer.style.display = "block";
        settingsSections.forEach(section => {
            section.style.display = "none";
        });
        const sectionToShow = document.getElementById(`${button.name}-section`);
        sectionToShow.style.display = "flex";
    });
});

closePanelBtn.addEventListener("click", () => {
    panel.style.display = "none";
    menuContainer.style.display = "none";
    settingsSections.forEach(section => {
        section.style.display = "none";
    });
});

//changing the theme
const themeSelect = document.getElementById('theme-select');
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else if (theme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('light-mode', 'dark-mode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }
}
themeSelect.addEventListener('change', (event) => {
    const selectedTheme = event.target.value;
    applyTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

//dynamically adjust the width of the theme select element to fit the text
const select = document.querySelector('select');
select.addEventListener('change', (event) => {
    let tempSelect = document.createElement('select'),
        tempOption = document.createElement('option');

    tempOption.textContent = event.target.options[event.target.selectedIndex].text;
    tempSelect.style.cssText += `
        visibility: hidden;
        position: fixed;
    `;
    tempSelect.appendChild(tempOption);
    event.target.after(tempSelect);

    const tempSelectWidth = tempSelect.getBoundingClientRect().width;
    event.target.style.width = `${tempSelectWidth}px`;
    tempSelect.remove();
});

let isRecording = false;
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const micButton = document.getElementById('microphone-btn');
    const messagesContainer = document.querySelector('.messages-container');
    const settings = document.querySelector('.settings');
    const dotAnimation = document.getElementById('dot-animation');
    const voiceAssistingOverlay = document.querySelector('.voice-assisting-overlay');
    const capyMessage = document.querySelector('.capy-message');
    
    $(capyMessage).textillate({
        loop: true,
        minDisplayTime: 1000,
        initialDelay: 0,
        in: {
            effect: 'fadeInUp',
            delayScale: 1.5,
            delay: 30,
            sync: false,
            shuffle: false
        },
        out: {
            effect: 'fadeOutUp',
            delayScale: 1.5,
            delay: 30,
            sync: false,
            shuffle: false
        }
    });

    micButton.addEventListener('click', () => {
        if (isRecording) return;
        isRecording = true;
        setTimeout(() => { isRecording = false; }, 500);

        card.classList.toggle('shrink');
        const isHidden = messagesContainer.style.display === 'none';

        messagesContainer.style.display = isHidden ? 'block' : 'none';
        settings.style.display = isHidden ? 'flex' : 'none';
        voiceAssistingOverlay.classList.toggle('show');

        setTimeout(() => {
            dotAnimation.classList.toggle('show');
            const computedStyle = window.getComputedStyle(capyMessage);
            const isMessageHidden = computedStyle.display === 'none';

            if (isMessageHidden){
                capyMessage.style.display = 'block';
                setTimeout(() => {
                    capyMessage.style.opacity = '1';
                    $(capyMessage).textillate('start');
                }, 10);
            } else {
                capyMessage.style.opacity = '0';
                $(capyMessage).textillate('stop');
                setTimeout(() => {
                    capyMessage.style.display = 'none';
                }, 500);
            }
        }, 500);
    });
});
