// routes/index.js
const express = require('express');
const db = require('../database/db');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
  // Запрос к БД: получить популярные истории (по просмотрам) и топ путешественников
  const popularStoriesQuery = `SELECT * FROM stories ORDER BY views DESC LIMIT 3`;
  const topTravelersQuery = `
    SELECT users.username, COUNT(stories.id) as story_count
    FROM users
    LEFT JOIN stories ON users.id = stories.author_id
    GROUP BY users.id
    ORDER BY story_count DESC
    LIMIT 5
  `;

  db.all(popularStoriesQuery, [], (err, stories) => {
    if (err) {
      console.error(err);
      stories = [];
    }
    db.all(topTravelersQuery, [], (err, travelers) => {
      if (err) {
        console.error(err);
        travelers = [];
      }
      // Рендерим страницу index.ejs и передаем в нее данные
      res.render('index', { 
        stories: stories, 
        travelers: travelers,
        user: req.session.user // Передаем данные пользователя в шаблон
      });
    });
  });
});

module.exports = router;