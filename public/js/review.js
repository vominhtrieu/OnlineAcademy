const stars = $('.fa-star');
const reviewForm = $('#reviewForm');

const scoreMessage = reviewForm.find('#scoreMessage');
const scoreInput = reviewForm.find('#scoreInput');
const scoreMessages = ['Rất tệ', 'Tệ', 'Ổn', 'Khá tốt', 'Tuyệt vời'];

stars.hover(function () {
  const score = +$(this).attr('data-score');
  scoreInput.val(score);
  scoreMessage.text(scoreMessages[score - 1]);

  for (let i = 0; i < 5; i++) {
    stars.eq(i).removeClass('checked');
  }

  for (let i = 0; i < score; i++) {
    stars.eq(i).addClass('checked');
  }
});

function setActionReviewForm(action, score, message) {
  reviewForm.attr('action', action);
  score = +score || 5;
  scoreInput.val(score);

  if (message) reviewForm.get(0).message.value = message;
  for (let i = 0; i < 5; i++) {
    stars.eq(i).removeClass('checked');
  }

  for (let i = 0; i < score; i++) {
    stars.eq(i).addClass('checked');
  }
  scoreMessage.text(scoreMessages[score - 1]);
}
