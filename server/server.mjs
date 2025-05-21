import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { insertUser, findUserByEmail } from './db.mjs';  // DB接続関数をインポート
import { generateToken, verifyToken } from './auth.mjs';  // auth.js からインポート

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // 本番では適切に設定する
  },
});

app.use(cors());
app.use(bodyParser.json());

// ユーザー認証用エンドポイント
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // SQLiteからユーザーを検索
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'ユーザーが見つかりません' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'パスワードが間違っています' });
  }

  const token = generateToken(email);
  return res.json({ token, message: 'ログイン成功' });
  
});

// ユーザー登録用エンドポイント
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: '既に登録済みです' });

  await insertUser(email, password);
  res.json({ message: '登録成功しました' });
});


// Socket.IO接続と認証（必要なら）
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('トークンがありません'));
  }

  try {
    const decoded = verifyToken(token);  // auth.jsのverifyTokenを使用
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('認証エラー'));
  }
});

io.on('connection', (socket) => {
  console.log('接続:', socket.user.email);

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('切断:', socket.user.email);
  });
});

// サーバー起動
server.listen(3001, () => {
  console.log('サーバーが3001番ポートで起動中');
});
