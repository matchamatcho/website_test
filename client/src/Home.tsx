// src/pages/Home.tsx

import React, { useState , useEffect } from 'react';
import { auth } from './firebase';
import type { User } from '@firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';

import {
    collection,
    addDoc,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import './Home.css'; // CSSファイルを読み込みます
import Header from './Header';

type Todo = {
    //プロパティ value は文字列型
    value: string;
    readonly id: number;
    checked: boolean;
    removed: boolean;
};

type Post = {
    id: string;
    title: string;
    date: string;
    todos: Todo[];
};


const Home: React.FC = () => {

    //DBから投稿を取得
    useEffect(() => {
    const fetchPosts = async () => {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const loadedPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedPosts.push({
            id: doc.id,
            title: data.title,
            date: data.date,
            todos: data.todos,
        });
        });

        setPosts(loadedPosts);
    };

    fetchPosts();
    }, []);

    

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


    const handlePost = async () => {
        if (!title || !currentTodo) return;
        const now = new Date();
        const newPost: Post = {
            id: now.getTime(),
            title,
            todos: currentTodo,
            date: now.toLocaleString(),
        };

        try {
            const userPostsRef = collection(db, 'users', auth.currentUser.uid, 'posts');
            
             // ★ Firestoreに送信する直前の currentTodo の内容を確認するためにログを追加
            console.log('Submitting currentTodo to Firestore:', currentTodo);
            console.log('Submitting title to Firestore:', title);

            await addDoc(userPostsRef, {
                title: newPost.title,
                todos: newPost.todos,
                date: Timestamp.now(),
            });

            setPosts((posts) => [newPost, ...posts]);
            setTitle('');
            setCurrentTodo([]);
            } catch (e) {
            console.error('投稿の保存に失敗しました', e);
        }
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
            <Header />

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
