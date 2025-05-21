import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import RegisterForm from './RegisterForm'
import TodoApp from './TodoApp'
import Mypage from './Mypage'; // ← 追加
//import Chat from './Chat';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/todo" element={<TodoApp />} />
        <Route path="/mypage" element={<Mypage />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
