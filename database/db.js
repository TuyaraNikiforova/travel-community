// database/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Указываем путь к файлу базы данных
const dbPath = path.resolve(__dirname, 'travel.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Успешное подключение к БД.');
  }
});

// Создаем таблицы
db.serialize(() => {
  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'traveler' -- 'admin', 'traveler'
  )`);

  // Таблица историй
  db.run(`CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    travel_type TEXT, -- 'Пеший', 'Авто' и т.д.
    season TEXT,
    views INTEGER DEFAULT 0,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
  )`);

  // Таблица комментариев
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER,
    author_name TEXT NOT NULL, -- Для гостей храним имя, для пользователей - их username
    user_id INTEGER, -- Может быть NULL для гостей
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

module.exports = db;