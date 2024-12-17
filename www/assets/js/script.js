document.addEventListener('DOMContentLoaded', () => {
    // System App Management
    const systemAppContainer = document.getElementById('system-app-path-container');
    const systemKeywordsInput = systemAppContainer.querySelector('.keywords-for-app');
    const systemPathInput = systemAppContainer.querySelector('.system-app-path');
    const addSystemPathButton = document.getElementById('add-path-button');
    const systemAppsList = document.createElement('div');
    systemAppsList.id = 'system-apps-list';
    systemAppsList.classList.add('apps-list');
    systemAppContainer.appendChild(systemAppsList);

    // Web App Management
    const webAppContainer = document.getElementById('web-app-path-container');
    const webKeywordsInput = webAppContainer.querySelector('.keywords-for-url');
    const webUrlInput = webAppContainer.querySelector('.url-path');
    const addWebUrlButton = document.getElementById('add-url-button');
    const webAppsList = document.createElement('div');
    webAppsList.id = 'web-apps-list';
    webAppsList.classList.add('apps-list');
    webAppContainer.appendChild(webAppsList);

    // Helper function to create and store app entries
    function createAppEntry(container, keywordsInput, pathInput, appsList, storageKey) {
        const keywords = keywordsInput.value.trim();
        const path = pathInput.value.trim();

        if (keywords && path) {
            // Create a new entry element
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('app-entry');
            
            // Create elements for keywords and path
            const keywordsSpan = document.createElement('span');
            keywordsSpan.textContent = `${keywords}`;
            
            const pathSpan = document.createElement('span');
            pathSpan.textContent = `${path}`;

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✕';
            deleteButton.classList.add('delete-app-entry');
            
            // Append elements to entry
            entryDiv.appendChild(keywordsSpan);
            entryDiv.appendChild(pathSpan);
            entryDiv.appendChild(deleteButton);
            
            // Add to list
            appsList.appendChild(entryDiv);

            // Retrieve existing apps from localStorage
            const existingApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // Add new app
            existingApps.push({ keywords, path });
            
            // Save to localStorage
            localStorage.setItem(storageKey, JSON.stringify(existingApps));

            // Clear inputs
            keywordsInput.value = '';
            pathInput.value = '';

            // Add delete functionality
            deleteButton.addEventListener('click', () => {
                // Remove from DOM
                entryDiv.remove();

                // Remove from localStorage
                const updatedApps = existingApps.filter(
                    app => !(app.keywords === keywords && app.path === path)
                );
                localStorage.setItem(storageKey, JSON.stringify(updatedApps));
            });
        }
    }
    // Load saved apps on page load
    function loadSavedApps(storageKey, appsList) {
        const savedApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        savedApps.forEach(app => {
            // Create entry div
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('app-entry');
            
            // Create elements for keywords and path
            const keywordsSpan = document.createElement('span');
            keywordsSpan.textContent = `${app.keywords}`;
            
            const pathSpan = document.createElement('span');
            pathSpan.textContent = `${app.path}`;

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✕';
            deleteButton.classList.add('delete-app-entry');
            
            // Append elements to entry
            entryDiv.appendChild(keywordsSpan);
            entryDiv.appendChild(pathSpan);
            entryDiv.appendChild(deleteButton);
            
            // Add to list
            appsList.appendChild(entryDiv);

            // Add delete functionality
            deleteButton.addEventListener('click', () => {
                // Remove from DOM
                entryDiv.remove();

                // Remove from localStorage
                const existingApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const updatedApps = existingApps.filter(
                    existingApp => !(existingApp.keywords === app.keywords && existingApp.path === app.path)
                );
                localStorage.setItem(storageKey, JSON.stringify(updatedApps));
            });
        });
    }

    // Event listeners for adding apps
    addSystemPathButton.addEventListener('click', () => {
        createAppEntry(
            systemAppContainer, 
            systemKeywordsInput, 
            systemPathInput, 
            systemAppsList, 
            'systemApps'
        );
    });

    addWebUrlButton.addEventListener('click', () => {
        createAppEntry(
            webAppContainer, 
            webKeywordsInput, 
            webUrlInput, 
            webAppsList, 
            'webApps'
        );
    });

    // Load saved apps when page loads
    loadSavedApps('systemApps', systemAppsList);
    loadSavedApps('webApps', webAppsList);
});


// for dynamic text area
const textarea = document.querySelector("textarea");
textarea.addEventListener("input", e => {
    textarea.style.height = "30px";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight}px`;
});

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
