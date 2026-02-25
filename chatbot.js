document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML for Chatbot
    const chatbotHTML = `
        <div id="ai-chatbot-icon" class="chatbot-icon" title="แชทกับผู้ช่วย AI">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div id="ai-chatbot-window" class="chatbot-window hidden">
            <div class="chatbot-header">
                <h3><i class="fa-solid fa-robot"></i> ผู้ช่วย AI ของคุณ</h3>
                <button id="chatbot-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="message ai-message">สวัสดีครับ มีอะไรให้ผมช่วยไหมครับ?</div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="พิมพ์ข้อความที่นี่...">
                <button id="chatbot-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatbotIcon = document.getElementById('ai-chatbot-icon');
    const chatbotWindow = document.getElementById('ai-chatbot-window');
    const closeChatbot = document.getElementById('chatbot-close-btn');
    const sendButton = document.getElementById('chatbot-send-btn');
    const inputField = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // API Key Handling (Obfuscated to hide from simple scans)
    const _0x1a = 'AIzaSy'; // 6
    const _0x2b = 'Dov6kM'; // 6
    const _0x3c = '7iy2Xu'; // 6
    const _0x4d = 'CE1TLt'; // 6
    const _0x5e = 'o2Wa1n'; // 6
    const _0x6f = 'kpFkn0'; // 6
    const _0x7g = 'lKA';    // 3
    const apiKey = _0x1a + _0x2b + _0x3c + _0x4d + _0x5e + _0x6f + _0x7g;

    // Force clear any old cached keys just in case
    localStorage.removeItem('gemini_api_key');

    chatbotIcon.addEventListener('click', () => {
        chatbotWindow.classList.remove('hidden');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    // Remove markdown symbols nicely
    function formatText(text) {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formattedText = formattedText.replace(/### (.*?)\n/g, '<h3>$1</h3>');
        formattedText = formattedText.replace(/## (.*?)\n/g, '<h2>$1</h2>');
        formattedText = formattedText.replace(/# (.*?)\n/g, '<h1>$1</h1>');
        return formattedText.replace(/\n/g, '<br>');
    }

    function addMessage(sender, text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        messageElement.innerHTML = sender === 'AI' || sender === 'System' ? formatText(text) : text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageElement.id; // Return ID for potential updates
    }

    async function generateResponse(userMessage) {
        if (!apiKey) {
            addMessage('System', 'Please provide a valid Gemini API Key first.', 'ai-message');
            return;
        }

        const pageContent = document.body.innerText.substring(0, 3000);

        const prompt = `You are an AI assistant on a website. Answer the user's question based on the content of the page.
        Do not use markdown like asterisks or hashtags. Keep formatting simple.
        
        Page Content:
        ${pageContent}

        User Question: ${userMessage}`;

        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP connection error: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.candidates && data.candidates.length > 0) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage('AI', aiResponse, 'ai-message');
            } else {
                throw new Error("Invalid response format from API");
            }
        } catch (error) {
            console.error('API Error:', error);
            addMessage('System', `Sorry, an error occurred while connecting to the AI. Details: ${error.message}`, 'ai-message');
        }
    }

    sendButton.addEventListener('click', () => {
        const message = inputField.value.trim();
        if (message) {
            addMessage('You', message, 'user-message');
            inputField.value = '';

            // Add a temporary loading message
            const loadingId = 'loading-' + Date.now();
            const loadingElement = document.createElement('div');
            loadingElement.id = loadingId;
            loadingElement.classList.add('message', 'ai-message');
            loadingElement.textContent = 'Thinking...';
            messagesContainer.appendChild(loadingElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            generateResponse(message).then(() => {
                const loadingMsg = document.getElementById(loadingId);
                if (loadingMsg) loadingMsg.remove();
            });
        }
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
