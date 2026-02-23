const fs = require('fs');
const glob = require('glob'); // Not using glob to avoid dependencies if not installed
const path = require('path');

const cssCode = `

/* Chatbot UI */
.chatbot-icon {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: var(--gradient);
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    transition: transform 0.3s ease;
}

.chatbot-icon:hover {
    transform: scale(1.1);
}

.chatbot-window {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow: hidden;
    transition: opacity 0.3s, transform 0.3s;
    transform-origin: bottom right;
}

.chatbot-window.hidden {
    opacity: 0;
    transform: scale(0);
    pointer-events: none;
}

.chatbot-header {
    background: var(--gradient);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chatbot-header h3 {
    margin: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.chatbot-header button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
}

.chatbot-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: #f8f9fa;
}

.message {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 15px;
    font-size: 0.95rem;
    line-height: 1.5;
}

.user-message {
    background: var(--primary-blue);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 2px;
}

.ai-message {
    background: white;
    color: var(--text-main);
    align-self: flex-start;
    border-bottom-left-radius: 2px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.chatbot-input-area {
    padding: 15px;
    background: white;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
}

.chatbot-input-area input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    font-family: inherit;
}

.chatbot-input-area input:focus {
    border-color: var(--primary-blue);
}

.chatbot-input-area button {
    background: var(--gradient);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s;
}

.chatbot-input-area button:hover {
    transform: scale(1.05);
}

.ai-message strong {
    font-weight: 600;
}
`;

fs.appendFileSync('styles.css', cssCode, 'utf8');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('chatbot.js')) {
        content = content.replace('</body>', '    <script src="chatbot.js"></script>\n</body>');
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('Done!');
