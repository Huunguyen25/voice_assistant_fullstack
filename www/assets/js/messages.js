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

// Add Markdown parsing using Marked.js
// We need to add the script to the HTML file as well
function parseMarkdown(text) {
    // If marked is not loaded yet, return plain text
    if (typeof marked === 'undefined') {
        console.warn('Marked.js is not loaded. Displaying plain text instead.');
        return text;
    }
    
    // Configure marked to handle code blocks properly
    marked.setOptions({
        highlight: function(code, lang) {
            return code;
        },
        breaks: true,
        gfm: true
    });
    
    return marked.parse(text);
}

function addMessage(text, isAI = false) {
    const messagesList = document.getElementById('messages-list');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isAI ? 'ai-message' : 'user-message'}`;

    if (isAI) {
        // For AI messages, parse as Markdown and use ai-message-content class
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="assets/img/icon/chat-avatar.png" alt="AI">
            </div>
            <div class="ai-message-content">
                <div class="message-text markdown-body">${parseMarkdown(text)}</div>
            </div>
        `;
        
        // Apply syntax highlighting to code blocks if Prism.js is available
        if (typeof Prism !== 'undefined') {
            messageDiv.querySelectorAll('pre code').forEach((block) => {
                Prism.highlightElement(block);
            });
        }
    } else {
        // For user messages, escape HTML but don't parse as Markdown
        const escapedText = text.replace(/&/g, '&amp;')
                               .replace(/</g, '&lt;')
                               .replace(/>/g, '&gt;')
                               .replace(/"/g, '&quot;')
                               .replace(/'/g, '&#039;');
                               
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${escapedText}</div>
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
            // Sample markdown response for testing
            const markdownResponse = `Certainly! Below is a simple "Hello, World!" program written in C++:

\`\`\`cpp
#include <iostream>

int main() {
    // Output "Hello, World!" to the console
    std::cout << "Hello, World!" << std::endl;

    return 0;
}
\`\`\`

### Explanation:
- \`#include <iostream>\`: This line includes the input-output stream library, which is necessary for using \`std::cout\` to print to the console.
- \`int main()\`: This is the main function where the execution of the program begins.
- \`std::cout << "Hello, World!" << std::endl;\`: This line prints "Hello, World!" to the console. \`std::endl\` adds a newline character after the text.
- \`return 0;\`: This indicates that the program has ended successfully.

### How to Compile and Run:
1. Save the code in a file with a \`.cpp\` extension, e.g., \`hello.cpp\`.
2. Open a terminal or command prompt.
3. Compile the program using a C++ compiler, such as \`g++\`:
   \`\`\`bash
   g++ hello.cpp -o hello
   \`\`\`
4. Run the compiled program:
   \`\`\`bash
   ./hello
   \`\`\`
5. You should see the output:
   \`\`\`
   Hello, World!
   \`\`\`

That's it! You've just written and executed your first C++ program.`;
            
            addMessage(markdownResponse, true);
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