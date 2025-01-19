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
