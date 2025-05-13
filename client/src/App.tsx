import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import RegisterForm from './RegisterForm'
//import Chat from './Chat';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
