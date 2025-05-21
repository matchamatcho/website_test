import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './server/users.db',
  driver: sqlite3.Database
});

export async function hashPassword(password){
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

export async function insertUser(email, password) {
  const db = await dbPromise;
  const hashedPassword = await hashPassword(password);
  await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
}

export async function findUserByEmail(email) {
  const db = await dbPromise;
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}
