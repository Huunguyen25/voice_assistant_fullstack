document.addEventListener('DOMContentLoaded', () => {
    // Track highest IDs
    let highestSystemId = 0;
    let highestWebId = 0;
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

    // Helper function to update IDs and display
    function updateEntriesDisplay(storageKey, appsList) {
        // Clear the list
        appsList.innerHTML = '';
        
        // Get apps and sort them by ID
        const apps = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Reassign IDs and update display
        apps.forEach((app, index) => {
            const newId = index + 1;
            app.id = newId;
            
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('app-entry');
            
            const idSpan = document.createElement('span');
            idSpan.textContent = newId;
            
            const keywordsSpan = document.createElement('span');
            keywordsSpan.textContent = app.keywords;
            keywordsSpan.classList.add('keyword-identifier');
            
            const pathSpan = document.createElement('span');
            pathSpan.textContent = app.path;
            pathSpan.classList.add('path-url-identifier');
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✕';
            deleteButton.classList.add('delete-app-entry');
            
            entryDiv.appendChild(idSpan);
            entryDiv.appendChild(keywordsSpan);
            entryDiv.appendChild(pathSpan);
            entryDiv.appendChild(deleteButton);
            
            appsList.appendChild(entryDiv);
            
            // Add delete functionality
            deleteButton.addEventListener('click', () => {
                // Remove the app from storage
                const updatedApps = apps.filter(a => a.id !== app.id);
                localStorage.setItem(storageKey, JSON.stringify(updatedApps));
                
                // Update the display with new IDs
                updateEntriesDisplay(storageKey, appsList);
                
                // Update highest ID trackers
                if (storageKey === 'systemApps') {
                    highestSystemId = updatedApps.length;
                } else {
                    highestWebId = updatedApps.length;
                }
            });
        });
        
        // Update localStorage with reordered IDs
        localStorage.setItem(storageKey, JSON.stringify(apps));
    }

    // Helper function to create and store app entries
    function createAppEntry(container, keywordsInput, pathInput, appsList, storageKey) {
        // Get next ID based on storage key
        const nextId = storageKey === 'systemApps' ? ++highestSystemId : ++highestWebId;
        const keywords = keywordsInput.value.trim();
        const path = pathInput.value.trim();

        if (keywords && path) {
            // Retrieve existing apps from localStorage
            const existingApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // Add new app with ID
            existingApps.push({ id: existingApps.length + 1, keywords, path });
            
            // Save to localStorage
            localStorage.setItem(storageKey, JSON.stringify(existingApps));

            // Clear inputs
            keywordsInput.value = '';
            pathInput.value = '';
            
            // Update the display
            updateEntriesDisplay(storageKey, appsList);
        }
    }
    // Load saved apps on page load
    function loadSavedApps(storageKey, appsList) {
        // Simply use updateEntriesDisplay to show saved apps
        updateEntriesDisplay(storageKey, appsList);
        
        // Update highest ID tracking
        const savedApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (storageKey === 'systemApps') {
            highestSystemId = savedApps.length;
        } else {
            highestWebId = savedApps.length;
        }
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
