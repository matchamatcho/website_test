import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // ページのリロードを防ぐ

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message || 'ログイン成功'}`);
      } else {
        setMessage(`❌ ${data.message || 'ログインに失敗しました'}`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      setMessage('❌ ネットワークエラーが発生しました');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>メール:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1.5rem' }}>ログイン</button>
        <button type="button"
          style={{ marginTop: '1.5rem' }}
          onClick={() => navigate('/register')}
        >新規登録</button>

      </form>
      {message && (
        <div style={{ marginTop: '1rem' }}>{message}</div>
      )}
    </div>
  );
};

export default LoginForm;