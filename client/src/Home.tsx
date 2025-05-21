// src/pages/Home.tsx

import React, { useState } from 'react';
import './Home.css'; // CSSファイルを読み込みます

type Todo = {
    //プロパティ value は文字列型
    value: string;
    readonly id: number;
    checked: boolean;
    removed: boolean;
};

type Post = {
    id: number;
    title: string;
    date: string;
    todos: Todo[];
};


const Home: React.FC = () => {
    //状態を保存しておく
    const [posts, setPosts] = useState<Post[]>([]);//ポストの状態(配列)
    const [title, setTitle] = useState(''); //投稿のタイトルの状態
    const [currentTodo, setCurrentTodo] = useState<Todo[]>([]); //コンテンツの状態
    const [submitTodoText, setSubmitTodoText] = useState('');

    const handleAddTodo = () => {
        if (!submitTodoText) return;
        const newTodo: Todo = {
            id: new Date().getTime(),
            value: submitTodoText,
            checked: false,
            removed: false,
        };
        setCurrentTodo([...currentTodo, newTodo]);
        setSubmitTodoText('');
    }

    const handleRemoveTodo = (id: number) => {
        setCurrentTodo(currentTodo.filter(todo => todo.id !== id));
    }


    const handlePost = () => {
        if (!title || !currentTodo) return;
        const now = new Date();
        const newPost: Post = {
            id: now.getTime(),
            title,
            todos: currentTodo,
            date: now.toLocaleString(),
        };
        setPosts((posts) => [newPost, ...posts]);
        setTitle('');
        setCurrentTodo([]);
    };

    const handleEditTodo = (id: number, newValue: string) => {
        setCurrentTodo((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, value: newValue } : todo
            )
        );
    };


    return (
        <>
            <header className="header">
                <h1 className="header-title">TodoBoard</h1>
            </header>

            <div className="container">
            <h2>掲示板</h2>

            <input
            className="input"
            type="text"
            placeholder="Todoタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <div className="todo-form">
                <input
                className="input"
                type="text"
                placeholder="todo項目"
                value={submitTodoText}
                onChange={(e) => setSubmitTodoText(e.target.value)}
                />
                <button className="button" onClick={handleAddTodo}>追加</button>
            </div>

            <ul>
                {currentTodo.map((todo) => {
                    return(
                    <li key={todo.id}>
                        <input 
                            className="input"
                            type="text"
                            placeholder="項目名を編集"
                            value={todo.value}
                            onChange={(e) => handleEditTodo(todo.id, e.target.value)}

                        />
                        <button onClick={() => handleRemoveTodo(todo.id)}>削除</button>
                    </li>
                )}
            )}
            </ul>

            <button className="button" onClick={handlePost}>投稿</button>

            <div className="post-list">
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-date">{post.date}</p>
                        <ul>
                            {post.todos.map(todo => (
                                <li key={todo.id}>{todo.value}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            </div>
        </>
    );
};

export default Home;
