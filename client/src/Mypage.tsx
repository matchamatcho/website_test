// src/Mypage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Mypage: React.FC = () => {
  return (
    <div>
      <h1>マイページ</h1>
      <p>ここはユーザーの個人ページです。</p>
      <Link to="/todo">Todoアプリに戻る</Link>
    </div>
  );
};

export default Mypage;
