const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let onlineCount = 0;

wss.on('connection', (ws) => {
  // Increment the online user count
  onlineCount++;
  broadcastUserCount();

  ws.on('close', () => {
    // Decrement the online user count when a user disconnects
    onlineCount--;
    broadcastUserCount();
  });
});

function broadcastUserCount() {
  // Broadcast the current user count to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'userCount', count: onlineCount }));
    }
  });
}

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
