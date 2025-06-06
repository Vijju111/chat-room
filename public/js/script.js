const socket = io();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.querySelector('.user-list');
const clearButton = document.getElementById('clearButton'); 

let username = prompt("Please enter your username:");
let recipient = 'all'; 

socket.emit('newUser', username);

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim() !== '') {
    socket.emit('sendMessage', { content: message, to: recipient });
    messageInput.value = '';
  }
});

socket.on('newMessage', (message) => {
  displayMessage(message);
});

socket.on('updateUserList', (users) => {
  updateUserList(users);
});

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', message.sender === username ? 'sent' : 'received');
  messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function updateUserList(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const userItem = document.createElement('li');
    userItem.textContent = user;
    userItem.addEventListener('click', () => {
      recipient = user;
    });
    userList.appendChild(userItem);
  });
}

clearButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear your chat history?")) {
    chatMessages.innerHTML = ''; 
  }
});