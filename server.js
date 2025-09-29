// server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка сессий
app.use(session({
  secret: 'your-secret-key', // Замените на случайный сложный ключ!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Для разработки (false). Для продакшена (HTTPS) нужно true.
}));

// Чтобы парсить данные из форм
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Указываем, что статические файлы (CSS, JS, images) лежат в папке public
app.use(express.static('public'));

// Указываем, что используем EJS как шаблонизатор
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Подключаем маршруты (роуты)
const indexRouter = require('./routes/index');
const storiesRouter = require('./routes/stories');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/stories', storiesRouter);
app.use('/auth', authRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});