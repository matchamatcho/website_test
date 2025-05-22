import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './firebase';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      const error = err as FirebaseError;
      switch (error.code) {
        default:
          setError('ログインに失敗しました: ' + error.message);
      }
    }
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr />

      <p>アカウントをお持ちでない方はこちら:</p>
      <button onClick={handleGoToRegister}>新規登録</button>
    </div>
  );
};

export default Login;
