// Функция для отправки комментария
function submitComment(storyId) {
  const commentText = document.getElementById('comment-text').value;
  const authorName = document.getElementById('guest-name').value || 'Аноним'; // Для гостей

  // Отправляем данные на сервер с помощью Fetch API
  fetch('/stories/' + storyId + '/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: commentText,
      authorName: authorName
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Добавляем комментарий в список без перезагрузки страницы
      const commentList = document.getElementById('comment-list');
      const newComment = document.createElement('div');
      newComment.innerHTML = `<strong>${data.comment.author_name}</strong>: ${data.comment.text}`;
      commentList.appendChild(newComment);
      // Очищаем поле ввода
      document.getElementById('comment-text').value = '';
    } else {
      alert('Ошибка при отправке комментария');
    }
  });
}