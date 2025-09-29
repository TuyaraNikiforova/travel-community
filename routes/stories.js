// routes/stories.js
const express = require('express');
const db = require('../database/db');
const router = express.Router();
const filterBadWords = require('../utils/badWordsFilter'); // Убедитесь, что путь правильный

// Страница со списком всех историй
router.get('/', (req, res) => {
  const query = `
    SELECT stories.*, users.username 
    FROM stories 
    JOIN users ON stories.author_id = users.id 
    ORDER BY stories.created_at DESC
  `;
  
  db.all(query, [], (err, stories) => {
    if (err) {
      console.error(err);
      stories = [];
    }
    res.render('stories', { 
      stories: stories,
      user: req.session.user 
    });
  });
});

// Страница конкретной истории
router.get('/:id', (req, res) => {
  const storyId = req.params.id;
  
  // Увеличиваем счетчик просмотров
  db.run('UPDATE stories SET views = views + 1 WHERE id = ?', [storyId]);
  
  // Получаем историю
  const storyQuery = `
    SELECT stories.*, users.username 
    FROM stories 
    JOIN users ON stories.author_id = users.id 
    WHERE stories.id = ?
  `;
  
  // Получаем комментарии
  const commentsQuery = `
    SELECT * FROM comments 
    WHERE story_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.get(storyQuery, [storyId], (err, story) => {
    if (err || !story) {
      return res.status(404).send('История не найдена');
    }
    
    db.all(commentsQuery, [storyId], (err, comments) => {
      if (err) {
        comments = [];
      }
      res.render('story1', { 
        story: story,
        comments: comments,
        user: req.session.user 
      });
    });
  });
});

// Форма для создания новой истории
router.get('/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('story_form', { 
    user: req.session.user 
  });
});

// Обработка создания новой истории
router.post('/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  const { title, short_description, full_description, travel_type, season } = req.body;
  const authorId = req.session.user.id;
  
  const query = `
    INSERT INTO stories (title, short_description, full_description, travel_type, season, author_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [title, short_description, full_description, travel_type, season, authorId], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка при создании истории');
    }
    res.redirect('/stories/' + this.lastID);
  });
});

// Добавление комментария
router.post('/:id/comment', (req, res) => {
  const storyId = req.params.id;
  const { text, authorName } = req.body;
  
  // ФИКС: Используем фильтр плохих слов здесь, внутри функции
  const cleanText = filterBadWords(text);
  
  let userId = null;
  let finalAuthorName = authorName || 'Аноним';
  
  // Если пользователь авторизован, используем его данные
  if (req.session.user) {
    userId = req.session.user.id;
    finalAuthorName = req.session.user.username;
  }
  
  const query = `
    INSERT INTO comments (story_id, author_name, user_id, text)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [storyId, finalAuthorName, userId, cleanText], function(err) {
    if (err) {
      console.error(err);
      return res.json({ success: false, error: 'Ошибка при добавлении комментария' });
    }
    
    // Возвращаем новый комментарий
    res.json({
      success: true,
      comment: {
        id: this.lastID,
        author_name: finalAuthorName,
        text: cleanText,
        created_at: new Date().toISOString()
      }
    });
  });
});

module.exports = router;