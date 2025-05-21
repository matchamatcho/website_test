import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './server/users.db',
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

console.log('✅ usersテーブルを作成しました');
