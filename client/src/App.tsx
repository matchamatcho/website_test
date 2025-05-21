import React from 'react';
//BrowserRouter:URLに基づいてページを切り替える機能
//Routes:複数のRouteから最初にマッチした物だけを表示
//Route:各パスに対応するコンポーネントを表示
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './RegisterForm'
import Home from './Home'
import LoginForm from './Login';
//import Chat from './Chat';

//<Header> どのページにも共通で表示したいヘッダー
//
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
