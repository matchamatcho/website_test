//useStateフックをインポート
// ステートの値が更新されるとそのステートを持つコンポーネントとその子がすべて再レンダリングされる。
import { useState } from 'react';

//型を定義 アッパーキャメルケース
type Todo = {
  //プロパティ value は文字列型
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const App = () => {
  const [text, setText] = useState('');
  //useState<型指定>
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  //追加ボタンがおされた時に呼び出される todosステートを更新する関数
  const handleSubmit = () => {
      if(!text) return;

      //新規作成
      const newTodo: Todo={
        value: text,
        id: new Date().getTime(),
        checked: false,
        removed: false,
      };
      //更新前のステート(todos)をもとに新たなステートを作成。todosの先頭にnewTodoを追加
      setTodos((todos) => [newTodo, ...todos]);
      //フォームへの入力をクリア
      setText('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      //それぞれのtodoについて処理する関数
      //mapはshallow copyであり、表層しかコピーしない＝二段目以降のプロパティを参照する際に元の配列を参照してしまう。
      const newTodos = todos.map((todo)=>{
        if (todo.id === id) {
          //スプレッド構文はイミュータブルな操作＝コピーを作成して展開する操作！
          // 配列の階層ではなく要素の階層でshallow copyするからプロパティに関してもイミュータブルになる。
          // 中のvalueプロパティを引数(入力文字列）で上書きする
          return { ...todo, value: value};
        }
        return todo;

      });

      /*
            // todos ステート配列をチェック（あとでコメントアウト）
            console.log('=== Original todos ===');
            todos.map((todo) => {
              console.log(`id: ${todo.id}, value: ${todo.value}`);
            });
            */

      // /todosをnewTodosとして新たなステートを作成
      return newTodos;
    });
  };

  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return{ ...todo, checked};
        }
        return todo;
      });

      return newTodos;
    });
  };

  const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed};
        }
        return todo;
      });

      return newTodos;
    });
  };

  const handleFilter = (filter: Filter) => {
    setFilter(filter);
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

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  }



  return (
    //単一のjsx要素を記述する<p>1行目</p> <p>2行目</p>のように複数要素はNG
    <div>
      <select defaultValue="all" onChange={(e) => handleFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
       {/* フィルターが `removed` のときは「ごみ箱を空にする」ボタンを表示 */}
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
          return(
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() => handleCheck(todo.id, !todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked||todo.removed}
                value={todo.value}
                onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleRemove(todo.id, !todo.removed)}>
                {todo.removed ? '復元' : '削除'}  
              </button>
            </li>
          );
        })}
        
      </ul>

    </div>
  );
};