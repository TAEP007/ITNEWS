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

    const icon = document.getElementById('ai-chatbot-icon');
    const windowEl = document.getElementById('ai-chatbot-window');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const inputEl = document.getElementById('chatbot-input');
    const messagesEl = document.getElementById('chatbot-messages');

    icon.addEventListener('click', () => {
        windowEl.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.add('hidden');
    });

    const apiKey = 'AIzaSyBOleZFSg-WJKYZ2tGCydSAk07oaka2swg'; // API Key from user

    // Remove markdown symbols nicely
    function formatText(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        // Add user message
        appendMessage('user', text);
        inputEl.value = '';

        // Added loading indicator
        const loadingId = appendMessage('ai', 'กำลังพิมพ์คำตอบ...');

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error Details:", data);
                throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
            }

            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัยครับ ไม่มีข้อมูลตอบกลับจากระบบ";
            updateMessage(loadingId, formatText(reply));

        } catch (error) {
            console.error('Chatbot API Error:', error);
            // Display error details in the UI for debugging
            updateMessage(loadingId, `ข้อผิดพลาด: ${error.message}`);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    let msgCounter = 0;
    function appendMessage(sender, text) {
        msgCounter++;
        const id = 'msg-' + msgCounter;
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
        msgDiv.innerHTML = sender === 'ai' ? text : text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return id;
    }

    function updateMessage(id, text) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.innerHTML = text;
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }
});
