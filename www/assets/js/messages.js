function toggleButtons() {
    const chatbox = document.getElementById('chatbox');
    const microphoneButton = document.getElementById('microphone-btn');
    const sendButton = document.getElementById('send-btn');
    
    if (chatbox.value.trim()) {
        microphoneButton.style.display = 'none';
        sendButton.style.display = 'flex';
    } else {
        microphoneButton.style.display = 'flex';
        sendButton.style.display = 'none';
    }
}

function addMessage(text, isAI = false) {
    const messagesList = document.getElementById('messages-list');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isAI ? 'ai-message' : 'user-message'}`;

    if (isAI) {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="assets/img/icon/chat-avatar.png" alt="AI">
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
            </div>
        `;
    }
    
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

document.getElementById('send-btn').addEventListener('click', () => {
    const chatbox = document.getElementById('chatbox');
    const message = chatbox.value.trim();
    
    if (message) {
        addMessage(message, false);
        chatbox.value = '';
        toggleButtons();

        setTimeout(() => {
            //TODO: Replace with ai response
            addMessage('This is a sample AI response this message is is to test whether the chabot is working and if the width is correct.', true);
        }, 1000);
    }
});

document.getElementById('chatbox').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('send-btn').click();
    }
});

document.getElementById('chatbox').addEventListener('input', toggleButtons);

toggleButtons();