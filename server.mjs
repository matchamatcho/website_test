// server.mjs
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('チャットサーバーは起動しています');
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // 本番環境では限定してください
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 ユーザーが接続:', socket.id);

  socket.on('sendMessage', (message) => {
    console.log('📩 メッセージ:', message);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ ユーザー切断:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('✅ Socket.IO サーバーが 4000番ポートで起動中');
});
