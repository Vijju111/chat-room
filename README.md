# Chat App

A simple real-time chat application built with Node.js, Express, Socket.IO, and SQLite (using [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)).

## Features

- Real-time messaging with Socket.IO
- Public and private messaging
- User list updates in real-time
- Message history stored in SQLite database

## Requirements

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
chat-app/
├── public/           # Static frontend files (HTML, CSS, JS)
├── server.js         # Main server file
├── package.json      # Project metadata and dependencies
└── database.sqlite   # SQLite database (created automatically)
```

## Usage

- Enter a username to join the chat.
- Send messages to everyone or select a user for private messaging.
- Message history is loaded when you join.

## License

This project is licensed under the ISC License.
