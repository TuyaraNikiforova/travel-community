// utils/badWordsFilter.js
const badWords = ['хуй', 'блядь','сука']; // Добавьте свой список

function filterBadWords(text) {
  let filteredText = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  return filteredText;
}

module.exports = filterBadWords;