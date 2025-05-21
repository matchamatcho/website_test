// src/Mypage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import users from './data/users.json';
import './Mypage.css';

type Skill = {
  language: string;
  level: number;
};

type User = {
  id: number;
  name: string;
  profile: string;
  iconUrl: string;
  skills: Skill[];
};

const currentUserId = 1;
const availableLanguages = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#',
  'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Perl',
  'Haskell', 'Lua', 'R', 'Dart', 'Objective-C', 'Shell', 'Elixir',
  'F#', 'Assembly', 'SQL'
];

const Mypage: React.FC = () => {
  const initialUser = users.find((u) => u.id === currentUserId) as User | undefined;
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <div>ユーザー情報が見つかりません。</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSkillChange = (index: number, field: 'language' | 'level', value: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newSkills = [...prev.skills];
      if (field === 'level') {
        newSkills[index].level = Number(value);
      } else {
        newSkills[index].language = value;
      }
      return { ...prev, skills: newSkills };
    });
  };

  const addSkill = () => {
    setUser((prev) => prev ? {
      ...prev,
      skills: [...prev.skills, { language: availableLanguages[0], level: 0 }]
    } : prev);
  };

  const removeSkill = (index: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newSkills = prev.skills.filter((_, i) => i !== index);
      return { ...prev, skills: newSkills };
    });
  };

  // レベルに応じて色を決定（0に近いと青、5に近いと赤）
  const getSliderColor = (level: number) => {
    const r = Math.round((level / 5) * 255);
    const g = 0;
    const b = Math.round((1 - level / 5) * 255);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="mypage-container">
      <h1>マイページ</h1>

      <div className="card">
        <img
          src={user.iconUrl}
          alt={`${user.name}のアイコン`}
          className="icon"
        />
        <div>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="input-text shake-on-hover"
              />
              <br />
              <textarea
                name="profile"
                value={user.profile}
                onChange={handleChange}
                rows={4}
                className="textarea"
              />
              <div style={{ marginTop: '20px' }}>
                <h3>プログラミングスキル</h3>
                {user.skills.map((skill, index) => (
                  <div key={index} className="skill-row">
                    <select
                      value={skill.language}
                      onChange={(e) => handleSkillChange(index, 'language', e.target.value)}
                      className="select-skill"
                    >
                      {availableLanguages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={skill.level}
                      onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                      className="slider"
                      style={{ accentColor: getSliderColor(skill.level) }}
                    />
                    <span className="skill-level">{skill.level}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="button"
                    >
                      削除
                    </button>
                  </div>
                ))}
                <button onClick={addSkill} className="add-button">
                  スキルを追加
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="shake-on-hover">{user.name}</h2>
              <p>{user.profile}</p>
              <div style={{ marginTop: '20px' }}>
                <h3>プログラミングスキル</h3>
                {user.skills.length === 0 ? (
                  <p>登録されていません</p>
                ) : (
                  <ul>
                    {user.skills.map((skill, index) => (
                      <li
                        key={index}
                        className="shake-on-hover"
                        style={{ color: getSliderColor(skill.level) }}
                      >
                        {skill.language} : レベル {skill.level}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
        {isEditing ? '保存（仮）' : '編集'}
      </button>
      <br />
      <Link to="/todo">Todoアプリに戻る</Link>
    </div>
  );
};

export default Mypage;
