// Wait for both document ready and eel to be available
$(document).ready(function() {
    
    function checkEel() {
        if (typeof eel !== 'undefined') {
            initializeApp();
        } else {
            console.log("error with eel")
        }
    }

    function initializeApp() {
        // Move all your existing initialization code here
        let highestSystemId = 0;
        let highestWebId = 0;
        
        // System App Management
        const $systemAppContainer = $('#system-app-path-container');
        const $systemKeywordsInput = $systemAppContainer.find('.keywords-for-app');
        const $systemPathInput = $systemAppContainer.find('.system-app-path');
        const $addSystemPathButton = $('#add-path-button');
        const $systemAppsList = $('<div id="system-apps-list" class="apps-list"></div>');
        $systemAppContainer.append($systemAppsList);

        // Web App Management
        const $webAppContainer = $('#web-app-path-container');
        const $webKeywordsInput = $webAppContainer.find('.keywords-for-url');
        const $webUrlInput = $webAppContainer.find('.url-path');
        const $addWebUrlButton = $('#add-url-button');
        const $webAppsList = $('<div id="web-apps-list" class="apps-list"></div>');
        $webAppContainer.append($webAppsList);

        // API Key Management
        const $apiKeyContainer = $('#API-setting-section .non-draggable-setting-container');
        const $apiKeyInput = $apiKeyContainer.find('.api-key');
        const $addApiKeyButton = $('#add-api-button');
        
        // Create a container for displaying the API key (similar to app lists)
        const $apiKeyDisplay = $('<div id="api-key-display" class="apps-list"></div>');
        $apiKeyContainer.append($apiKeyDisplay);

        // Helper function to update API key display
        function updateApiKeyDisplay() {
            const apiKey = localStorage.getItem('apiKey');
            $apiKeyDisplay.empty();
            
            if (apiKey) {
                // Create display for the API key
                const $entryDiv = $('<div class="app-entry"></div>');
                const $idSpan = $('<span></span>').text('1');
                const $keySpan = $('<span class="path-url-identifier"></span>').text(
                    apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5)
                );
                const $deleteButton = $('<button class="delete-app-entry">✕</button>');
                
                $entryDiv.append($idSpan, $keySpan, $deleteButton);
                $apiKeyDisplay.append($entryDiv);
                
                // Hide add button when API key exists
                $addApiKeyButton.hide();
                
                // Disable the input field to prevent typing
                $apiKeyInput.prop('disabled', true)
                             .attr('placeholder', 'API Key added')
                             .blur(); // Unfocus the input field
                
                // Set up delete functionality
                $deleteButton.on('click', async function() {
                    try {
                        await eel.delete_api_key(apiKey)();
                        localStorage.removeItem('apiKey');
                        updateApiKeyDisplay();
                        $addApiKeyButton.show();
                        
                        // Re-enable the input field after deletion
                        $apiKeyInput.prop('disabled', false)
                                    .attr('placeholder', 'API Key');
                    } catch (error) {
                        console.error('Failed to delete API key:', error);
                        alert('Failed to delete API key. Please check if the backend is running.');
                    }
                });
            } else {
                // Show add button when no API key exists
                $addApiKeyButton.show();
                
                // Make sure the input field is enabled
                $apiKeyInput.prop('disabled', false)
                            .attr('placeholder', 'API Key');
            }
        }
        
        // Event listener for adding API key
        $addApiKeyButton.on('click', async function() {
            const apiKey = $apiKeyInput.val().trim();
            
            if (apiKey) {
                try {
                    // Use a generic name like 'openrouter' since we're only storing one key
                    await eel.add_api_key('openrouter', apiKey)();
                    
                    // Store in localStorage
                    localStorage.setItem('apiKey', apiKey);
                    
                    // Clear input and update display
                    $apiKeyInput.val('');
                    updateApiKeyDisplay();
                } catch (error) {
                    console.error('Failed to add API key:', error);
                    alert('Failed to add API key. Please check if the backend is running.');
                }
            }
        });

        // Helper function to update IDs and display
        function updateEntriesDisplay(storageKey, $appsList) {
            // Clear the list
            $appsList.empty();
            
            // Get apps and sort them by ID
            const apps = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // Reassign IDs and update display
            $.each(apps, function(index, app) {
                const newId = index + 1;
                app.id = newId;
                
                const $entryDiv = $('<div class="app-entry"></div>');
                const $idSpan = $('<span></span>').text(newId);
                const $keywordsSpan = $('<span class="keyword-identifier"></span>').text(app.keywords);
                const $pathSpan = $('<span class="path-url-identifier"></span>').text(app.path);
                const $deleteButton = $('<button class="delete-app-entry">✕</button>');
                
                $entryDiv.append($idSpan, $keywordsSpan, $pathSpan, $deleteButton);
                $appsList.append($entryDiv);
                
                // Modify delete functionality to include database deletion
                $deleteButton.on('click', async function() {
                    try {
                        // Remove from database based on type
                        if (storageKey === 'systemApps') {
                            await eel.delete_sys_command(app.keywords)();
                        } else {
                            await eel.delete_web_command(app.keywords)();
                        }

                        // Only proceed if database operation was successful
                        const updatedApps = apps.filter(a => a.id !== app.id);
                        localStorage.setItem(storageKey, JSON.stringify(updatedApps));
                        updateEntriesDisplay(storageKey, $appsList);
                        
                        if (storageKey === 'systemApps') {
                            highestSystemId = updatedApps.length;
                        } else {
                            highestWebId = updatedApps.length;
                        }
                    } catch (error) {
                        console.error('Failed to delete entry:', error);
                        alert('Failed to delete entry. Please check if the backend is running.');
                    }
                });
            });
            
            // Update localStorage with reordered IDs
            localStorage.setItem(storageKey, JSON.stringify(apps));
        }

        // Helper function to create and store app entries
        async function createAppEntry($container, $keywordsInput, $pathInput, $appsList, storageKey) {
            const nextId = storageKey === 'systemApps' ? ++highestSystemId : ++highestWebId;
            const keywords = $keywordsInput.val().trim();
            const path = $pathInput.val().trim();

            if (keywords && path) {
                try {
                    // Add to database based on type
                    if (storageKey === 'systemApps') {
                        await eel.add_sys_command(keywords, path)();
                    } else {
                        await eel.add_web_command(keywords, path)();
                    }

                    // Only proceed if database operation was successful
                    const existingApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    existingApps.push({ id: existingApps.length + 1, keywords, path });
                    localStorage.setItem(storageKey, JSON.stringify(existingApps));

                    $keywordsInput.val('');
                    $pathInput.val('');
                    updateEntriesDisplay(storageKey, $appsList);
                } catch (error) {
                    console.error('Failed to add entry:', error);
                    alert('Failed to add entry. Please check if the backend is running.');
                }
            }
        }
        
        // Load saved apps on page load
        function loadSavedApps(storageKey, $appsList) {
            // Simply use updateEntriesDisplay to show saved apps
            updateEntriesDisplay(storageKey, $appsList);
            
            // Update highest ID tracking
            const savedApps = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (storageKey === 'systemApps') {
                highestSystemId = savedApps.length;
            } else {
                highestWebId = savedApps.length;
            }
        }

        // Event listeners for adding apps
        $addSystemPathButton.on('click', function() {
            createAppEntry(
                $systemAppContainer, 
                $systemKeywordsInput, 
                $systemPathInput, 
                $systemAppsList, 
                'systemApps'
            );
        });

        $addWebUrlButton.on('click', function() {
            createAppEntry(
                $webAppContainer, 
                $webKeywordsInput, 
                $webUrlInput, 
                $webAppsList, 
                'webApps'
            );
        });

        // Load saved apps when page loads
        loadSavedApps('systemApps', $systemAppsList);
        loadSavedApps('webApps', $webAppsList);
        
        // Load API key if exists
        updateApiKeyDisplay();
    }
    checkEel();
});