import React from 'react';
//BrowserRouter:URLに基づいてページを切り替える機能
//Routes:複数のRouteから最初にマッチした物だけを表示
//Route:各パスに対応するコンポーネントを表示
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';

//<Header> どのページにも共通で表示したいヘッダー
//
const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
