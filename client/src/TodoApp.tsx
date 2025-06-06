import { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 型定義
type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

type TodoList = {
  id: number;
  name: string; //Todoタイトル
  todos: Todo[];
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const TodoApp = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [uid, setUid] = useState<string | null>(null);

  // ログイン中のユーザーを監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Firestoreからデータ取得
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'users', uid, 'todos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => doc.data() as Todo);
      setTodos(todosData);
    });
    return unsubscribe;
  }, [uid]);

  const handleSubmit = async () => {
    if (!text || !uid) return;
    const newTodo: Todo = {
      value: text,
      id: Date.now(),
      checked: false,
      removed: false,
    };
    await addDoc(collection(db, 'users', uid, 'todos'), newTodo);
    setText('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };


  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };


  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case 'all':
        // 削除されていないもの
        return !todo.removed;
      case 'checked':
        // 完了済 **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case 'unchecked':
        // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case 'removed':
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    //それぞれのtodoについて処理する関数
      //mapはshallow copyであり、表層しかコピーしない＝二段目以降のプロパティを参照する際に元の配列を参照してしまう。
    setTodos((todos) => {
      //スプレッド構文はイミュータブルな操作＝コピーを作成して展開する操作！
          // 配列の階層ではなく要素の階層でshallow copyするからプロパティに関してもイミュータブルになる。
          // 中のvalueプロパティを引数(入力文字列）で上書きする
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });

      return newTodos;
    });
  };


  return (
    <div>
      <select defaultValue="all" onChange={(e) => handleFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
       {/* フィルターが removed のときは「ごみ箱を空にする」ボタンを表示 */}
    {filter === 'removed' ? (
      <button 
      onClick={handleEmpty}
      disabled={todos.filter((todo) => todo.removed).length === 0}
      >ゴミ箱を空にする</button>
    ) : (
        //フィルターがcheckedでなければフォームを表示
      filter !== 'checked' && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input 
            type="text" 
            // onChange イベント（＝入力テキストの変化）を text ステートに反映する
            value={text} 
            onChange={(e) => handleChange(e)} />
          <input
            type="submit"
            value="追加"
            onSubmit={handleSubmit}
          />
        </form>
      )
    )}
      {/*// 追加されたToDoをリスト表示*/}
      <ul>
        {/* mapは非破壊メソッド＝イミュータブル */}
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() => handleTodo(todo.id, 'checked', !todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleTodo(todo.id, 'value', e.target.value)}
              />
              <button
                onClick={() => handleTodo(todo.id, 'removed', !todo.removed)}
              >
                {todo.removed ? '復元' : '削除'}
              </button>
            </li>
          );
        })}
        
      </ul>

    </div>
  );
};

export default TodoApp;
