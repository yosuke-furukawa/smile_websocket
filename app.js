const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 3001 });
const VideoRecord = require('./lib/VideoRecord');
app.use(express.static(__dirname + "/public"));
wss.on('connection', (socket) => {
  VideoRecord(socket, wss);
});
app.listen(process.env.PORT || 3000);
