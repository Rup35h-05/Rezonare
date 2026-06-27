document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userMessage = document.getElementById('message-input').value;
    if (userMessage.trim() === '') return;

    const chatWindow = document.getElementById('chat-window');
    
    // Create user message row
    const userMsgRow = document.createElement('div');
    userMsgRow.className = 'msg-row';
    userMsgRow.innerHTML = `
        <div class="msg-text user">
            <h2>User</h2>
            <p>${userMessage}</p>
        </div>
    `;
    chatWindow.appendChild(userMsgRow);
    document.getElementById('message-input').value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    let response = await fetch("/api/messages",{
        method:"POST",
        headers: new Headers({'content-type': 'application/json'}),
        body:JSON.stringify({message:userMessage})
      })
    // Simulate AI response
    const aiMsgRow = document.createElement('div');
    aiMsgRow.className = 'msg-row';
    aiMsgRow.innerHTML = `
        <div class="msg-text bot">
            <h2>AI</h2>
            <p>${(await response.json()).message}</p>
        </div>
    `;
    setTimeout(() => {
        chatWindow.appendChild(aiMsgRow);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1000);
}
