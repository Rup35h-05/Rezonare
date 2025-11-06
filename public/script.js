const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);

document.querySelector("#message-input").addEventListener("change",sendMessage)
async function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        displayMessage(message, 'user');
        messageInput.value = '';
      let response = await fetch("/api/messages",{
        method:"POST",
        headers: new Headers({'content-type': 'application/json'}),
        body:JSON.stringify({message})
      })
      displayMessage((await response.json()).message,'bot');
    }
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
