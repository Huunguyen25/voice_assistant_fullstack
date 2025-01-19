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

let cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.onmousemove = function(e){
        const rect = card.getBoundingClientRect();
        let x = e.pageX - rect.left;
        let y = e.pageY - rect.top;
        
        card.style.setProperty('--x', x + 'px');
        card.style.setProperty('--y', y + 'px');
    }
})

let isRecording = false;  // Track recording state
let isProcessing = false;  // Prevent spam clicks

document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const micButton = document.querySelector('.mic-wrapper');
    const messagesContainer = document.querySelector('.messages-container');
    const settings = document.querySelector('.settings');
    const dotAnimation = document.getElementById('dot-animation');
    const voiceAssistingOverlay = document.querySelector('.voice-assisting-overlay');

    micButton.addEventListener('click', () => {
        if (isProcessing) return;

        isProcessing = true;

        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
        setTimeout(() => {
            isProcessing = false;
        }, 500);
    });

    function startRecording() {
        isRecording = true;
        card.classList.add('shrink');
        micButton.classList.replace('mic-wrapper', 'mic-stop');
        messagesContainer.style.display = 'none';
        settings.style.display = 'none';
        dotAnimation.classList.add('show');
        voiceAssistingOverlay.classList.add('show');
    }
    
    function stopRecording() {
        isRecording = false;
        card.classList.remove('shrink');
        micButton.classList.replace('mic-stop', 'mic-wrapper');
        messagesContainer.style.display = 'block';
        settings.style.display = 'block';
        dotAnimation.classList.remove('show');
        voiceAssistingOverlay.classList.remove('show');
    }
    window.stopRecording = stopRecording;
});