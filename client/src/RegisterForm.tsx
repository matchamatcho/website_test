// client/src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>新規登録</h2>
      <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">登録</button>
      <p>{message}</p>
      <button type="button"
          style={{ marginTop: '1.5rem' }}
          onClick={() => navigate('/login')}
        >ログイン</button>
    </form>
  );
};

export default RegisterForm;
