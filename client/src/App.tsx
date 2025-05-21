import React from 'react';
//BrowserRouter:URLに基づいてページを切り替える機能
//Routes:複数のRouteから最初にマッチした物だけを表示
//Route:各パスに対応するコンポーネントを表示
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

//<Header> どのページにも共通で表示したいヘッダー
//
const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </Router>
  );
};

export default App;
