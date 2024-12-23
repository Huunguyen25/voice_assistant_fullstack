function toggleButtons() {
    const chatbox = document.getElementById('chatbox');
    const microphoneButton = document.getElementById('microphone-btn');
    const sendButton = document.getElementById('send-btn');
    
    if (chatbox.value.trim()) {
        microphoneButton.style.display = 'none';  // Hide microphone
        sendButton.style.display = 'flex';      // Show send button
    } else {
        microphoneButton.style.display = 'flex'; // Show microphone
        sendButton.style.display = 'none';      // Hide send button
    }
}

// Function to add a new message
function addMessage(text, isAI = false) {
    const messagesList = document.getElementById('messages-list');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isAI ? 'ai-message' : 'user-message'}`;

    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <img src="assets/img/${isAI ? 'icon/chat-avatar.png' : 'user-avatar.png'}" alt="${isAI ? 'AI' : 'User'}">
        </div>
        <div class="message-content">
            <div class="message-text">${text}</div>
        </div>
    `;
    
    messagesList.appendChild(messageDiv);
    scrollToBottom();
    const textarea = document.querySelector(".chatbox");
    const card = document.querySelector(".card");
    textarea.style.height = "42px";
    card.style.height = "42px";
}

// Function to automatically scroll to the bottom of messages
function scrollToBottom() {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle sending messages
document.getElementById('send-btn').addEventListener('click', () => {
    const chatbox = document.getElementById('chatbox');
    const message = chatbox.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, false);
        chatbox.value = '';
        toggleButtons();
        
        // Simulate AI response (replace this with your actual AI implementation)
        setTimeout(() => {
            addMessage('This is a sample AI response this message is is to test whether the chabot is working and if the width is correct.', true);
        }, 1000);
    }
});

// Handle Enter key to send message
document.getElementById('chatbox').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('send-btn').click();
    }
});

// Add input event listener for toggle logic
document.getElementById('chatbox').addEventListener('input', toggleButtons);

// Initialize button state on page load
toggleButtons();