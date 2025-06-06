const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Change from sqlite3 to better-sqlite3
const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    recipient TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

app.use(express.static('public'));

let users = [];
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newUser', (username) => {
    socket.username = username;
    users.push(username);
    userSockets.set(username, socket.id);
    io.emit('updateUserList', users);

    // Use better-sqlite3 to get all messages
    const rows = db.prepare('SELECT * FROM messages').all();
    rows.forEach(row => {
      if (row.recipient === 'all' || row.recipient === socket.username || row.sender === socket.username) {
        socket.emit('newMessage', { sender: row.sender, content: row.content });
      }
    });
  });

  socket.on('sendMessage', (message) => {
    const { content, to } = message;

    // Insert message using better-sqlite3
    db.prepare('INSERT INTO messages (sender, recipient, content) VALUES (?, ?, ?)')
      .run(socket.username, to, content);

    if (to === 'all') {
      io.emit('newMessage', { sender: socket.username, content });
    } else {
      const recipientSocketId = userSockets.get(to);
      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('newMessage', { sender: socket.username, content });
        socket.emit('newMessage', { sender: socket.username, content });
      } else {
        console.log(`User ${to} is offline. Message stored.`);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    users = users.filter(user => user !== socket.username);
    userSockets.delete(socket.username);
    io.emit('updateUserList', users);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});