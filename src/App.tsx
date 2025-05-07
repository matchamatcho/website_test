//状態を管理するフック
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';
import './App.css';

//バックエンドに接続
const socket = io('http://localhost:4000');

function App() {
  //テキスト欄に現在入力されている内容 
  const [message, setMessage] = useState('');
  //配列として保持されたチャット履歴
  const [messages, setMessages] = useState<string[]>([]);

  //最初に実行される
  useEffect(() => {
    //サーバーから"receiveMessage"イベントを受信したらメッセージを履歴に追加
    socket.on('receiveMessage', (newMessage: string) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    //コンポーネントが消えるときにイベントを解除
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  //送信ボタンを押したときの処理
  const handleSend = () => {
    if (message.trim() !== '') {
      //空でないメッセージをサーバーに送信
      socket.emit('sendMessage', message);
      //入力欄を空にリセット(送った感が出るね)
      setMessage('');
    }
  };

//UI
  return (
    <div style={{ padding: 20 }}>
      <h1>チャットアプリ</h1>
      <div style={{ height: 200, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, i) => (
          //メッセージ配列を一つずつ描画
          <div key={i}>{msg}</div>
        ))}
      </div>
    <input
      type="text"
      value={message}
      placeholder="メッセージを入力"
      onChange={(e) => setMessage(e.target.value)}
      style={{ width: '80%', marginRight: 10 }}
    />
    <button onClick={handleSend}>送信</button>
    </div>
);
}

export default App
