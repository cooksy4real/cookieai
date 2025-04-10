document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startChatBtn = document.getElementById('start-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInterface = document.getElementById('chat-interface');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Initialize chat interface
    function initChat() {
        chatInterface.classList.remove('hidden');
        setTimeout(() => {
            chatInterface.classList.add('visible');
        }, 10);
        userInput.focus();
        document.body.style.overflow = 'hidden';
        
        // Add welcome message if chat is empty
        if (chatMessages.children.length === 0) {
            addMessage("Hello! I'm an AI assistant. Ask me anything or teach me something new!", false, "system");
        }
    }
    
    // Close chat interface
    function closeChat() {
        chatInterface.classList.remove('visible');
        setTimeout(() => {
            chatInterface.classList.add('hidden');
        }, 300);
        document.body.style.overflow = 'auto';
    }
    
    // Add message to chat
    function addMessage(content, isUser, source) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        const p = document.createElement('p');
        p.textContent = content;
        contentDiv.appendChild(p);
        
        // Add source if provided and not user message
        if (!isUser && source && source !== "system") {
            const sourceSpan = document.createElement('span');
            sourceSpan.classList.add('message-source');
            sourceSpan.textContent = `[${source}]`;
            contentDiv.appendChild(sourceSpan);
        }
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle user input
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Check for teach command
        if (message.toLowerCase().startsWith('teach me that')) {
            handleTeachCommand(message);
            return;
        }
        
        addMessage(message, true);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message');
        typingIndicator.innerHTML = '<div class="message-content typing"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Get bot response
        getBotResponse(message, typingIndicator);
    }
    
    // Handle teach command
    function handleTeachCommand(message) {
        const teachPattern = /teach me that (.*) is (.*)/i;
        const match = message.match(teachPattern);
        
        if (match && match.length >= 3) {
            const topic = match[1].trim();
            const info = match[2].trim();
            
            if (topic && info) {
                teachBot(topic, info);
                return;
            }
        }
        
        addMessage("Please use the format: 'Teach me that [topic] is [information]'", false, "help");
    }
    
    // Teach the bot new information
    async function teachBot(topic, info) {
        addMessage(`Teaching about: ${topic}`, true);
        
        try {
            const response = await fetch('http://localhost:5000/learn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, text: info })
            });
            
            if (!response.ok) throw new Error('Failed to teach');
            
            addMessage(`Thanks! I've learned about ${topic}. Ask me about it now!`, false, "learning");
        } catch (error) {
            addMessage("Oops, I couldn't save that information. Please try again.", false, "error");
        }
    }
    
    // Get bot response from backend
    async function getBotResponse(userMessage, typingIndicator) {
        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatMessages.removeChild(typingIndicator);
            }
            
            // Add bot response
            addMessage(data.response, false, data.source);
            
        } catch (error) {
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                chatMessages.removeChild(typingIndicator);
            }
            
            addMessage("I'm having some trouble right now. Please try again later.", false, "error");
            console.error('Error:', error);
        }
    }
    
    // Event Listeners
    startChatBtn.addEventListener('click', initChat);
    closeChatBtn.addEventListener('click', closeChat);
    sendButton.addEventListener('click', handleUserInput);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
    
    // Avatar expression changes
    userInput.addEventListener('focus', function() {
        const mouth = document.querySelector('.chatbot-avatar .mouth');
        if (mouth) {
            mouth.style.borderRadius = '30px 30px 0 0';
            mouth.style.transform = 'translateX(-50%) rotate(180deg)';
            mouth.style.height = '15px';
        }
    });
    
    userInput.addEventListener('blur', function() {
        const mouth = document.querySelector('.chatbot-avatar .mouth');
        if (mouth) {
            mouth.style.borderRadius = '0 0 30px 30px';
            mouth.style.transform = 'translateX(-50%)';
            mouth.style.height = '20px';
        }
    });
});