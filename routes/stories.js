// routes/stories.js (в обработчике POST /stories/:id/comment)
const filterBadWords = require('../utils/badWordsFilter');

// ... внутри функции ...
const cleanText = filterBadWords(text);
// Сохраняем в БД cleanText