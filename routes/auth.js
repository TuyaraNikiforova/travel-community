// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register'); // Нужно создать views/register.ejs
});

// Обработка формы регистрации
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Хешируем пароль
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send("Ошибка при регистрации");
    }
    // Сохраняем пользователя в БД
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
      if (err) {
        return res.status(400).send("Пользователь уже существует");
      }
      res.redirect('/auth/login');
    });
  });
});

// Страница входа
router.get('/login', (req, res) => {
  res.render('login'); // Нужно создать views/login.ejs
});

// Обработка формы входа
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Ищем пользователя в БД
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(400).send("Неверный логин или пароль");
    }
    // Сравниваем пароль с хешем
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        // Сохраняем пользователя в сессии
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect('/');
      } else {
        res.status(400).send("Неверный логин или пароль");
      }
    });
  });
});

// Выход
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;