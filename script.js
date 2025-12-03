const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const API_KEY ="AIzaSyATVAxe7AXEzc_1aw85PzHznLvaLxpnS10";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function(e){
    if(e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const message = userInput.value.trim();
    if(!message) return;

    appendMessage("user", message);
    userInput.value = "";

    // Typing placeholder
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("bot-message");
    typingDiv.innerText = "Typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: message,
                temperature: 0.7,
                candidateCount: 1
            })
        });

        const data = await response.json();
        const botMessage = data?.candidates?.[0]?.content;

        // Only show message if API returns text
        if (botMessage && botMessage.trim() !== "") {
            typingDiv.innerText = "";
            typeText(botMessage, typingDiv);
        } else {
            // If API returns empty or invalid, remove typing placeholder
            chatBox.removeChild(typingDiv);
        }

    } catch (error) {
        console.error(error);
        typingDiv.innerText = "Error connecting to API.";
    }
}

function appendMessage(sender, message) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
    msgDiv.innerText = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeText(text, element) {
    let i = 0;
    const interval = setInterval(() => {
        if(i < text.length){
            element.innerText += text.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, 30);
}

