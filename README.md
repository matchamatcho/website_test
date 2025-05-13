# 情報共有

## 環境構築a
[TypeScript][def3]

1. プロジェクトのフォルダを作成したいディレクトリで $npm create vite@latest<br>
2. ✔ Project name: » website_test<br>
  ✔ Select a framework: » React<br>
  ✔ Select a variant: » TypeScript<br>
3. 以下を実行<br>
  $cd my-chat-app<br>
  $npm install<br>
  $npm install socket.io-client<br>
  $npm install express socket.io cors<br>

## サーバー起動方法
### フロントエンド
$npm run dev
### バックエンド
$node server.mjs

※両方起動する

## pushとかクローンとか
[pushのながれ][def2]

[再クローン][def]

## 今後の実装
- チャット画面の改善
ユーザー名の入力	誰が発言したか分かるようにする<br>
入退室メッセージ表示	ユーザーの接続・切断時に通知を表示<br>
時間の表示	各メッセージに送信時刻を追加<br>
空メッセージの送信防止	空のまま送信できないようにする<br>
UIデザインの改善<br>
メッセージの整形	自分の発言と他人の発言を左右に分けて表示<br>
- 機能の追加
認証機能（ログイン）	ユーザーのIDやログイン状態を管理する<br>



[def]: https://qiita.com/hellhellmymy/items/b30db8e6ff6cdad9efcd
[def2]: https://qiita.com/nt-7/items/c5ea999a2638e03ee418
[def3]: https://qiita.com/ochiochi/items/efdaa0ae7d8c972c8103
[def4]: https://chatgpt.com/share/68132de3-48a4-8003-be83-c0e22c0206d2



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
