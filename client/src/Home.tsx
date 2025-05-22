import React, { useState , useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth'; // FirebaseUserを追加ampを追加
import type { User as FirebaseUser } from 'firebase/auth'
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

    const [posts, setPosts] = useState<Post[]>([]);//投稿されたポストの状態
    const [title, setTitle] = useState(''); //Todoタイトル入力フォームの状態
    const [submitTodoText, setSubmitTodoText] = useState(''); //Todo項目入力フォームの状態
    const [currentTodo, setCurrentTodo] = useState<Todo[]>([]); //現在編集中のtodoリストの状態

    //DBから投稿を取得
    //レンダリング後に実行される。第一引数には実行させたい副作用関数を記述する(今回はfetchPosts)
    useEffect(() => {
        console.log("useEffect triggered in Home.tsx"); // デバッグ用ログ
        //Firestoreからデータを取得する非同期関数
        const fetchPostsByAppUser = async (appUser: FirebaseUser) => {

        console.log("fetchPostsByAppUser called for user:", appUser.uid); // デバッグ用ログ

        try {
            const userPostsRef = collection(db, 'users', appUser.uid, 'posts');
            const querySnapshot = await getDocs(userPostsRef);
            const loadedPosts: Post[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Post型のidがstringであることを確認してください
                // (例: client/src/models.tsx で export type Post = { id: string; ... })
                loadedPosts.push({
                id: doc.id,
                title: data.title,
                date: data.date instanceof Timestamp ? data.date.toDate().toLocaleString() : String(data.date || ''),
                todos: data.todos || [], // todosが存在しない場合に備えて空配列をデフォルトに
                });
            });
            console.log("Posts loaded:", loadedPosts); // デバッグ用ログ
            setPosts(loadedPosts);
            } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]); // エラー時は投稿をクリアするなどの処理
            }
        };

        // 認証状態の変更を監視するリスナー
        //ログイン・ログアウト時に呼び出される
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
            // ユーザーがログインしている、または認証状態が確認できた
            console.log("User is authenticated, fetching posts for:", firebaseUser.uid); // デバッグ用ログ
            fetchPostsByAppUser(firebaseUser);//認証状態が確認できたときにフェッチする
            } else {
            // ユーザーがログアウトしている
            console.log("User is not authenticated."); // デバッグ用ログ
            setPosts([]); // 投稿をクリア
            }
        });

        // クリーンアップ関数: コンポーネントがアンマウントされるときに解除
        return () => {
            console.log("Unsubscribing from onAuthStateChanged."); // デバッグ用ログ
            unsubscribe();
        };
    }, []);
    //空の配列を渡すことで初回レンダリング時のみ実行,アンマウント時にクリーンアップ関数が実行される

    



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
