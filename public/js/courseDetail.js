let stars = $('.fa-star');
let scoreInput = $('#scoreInput');
let scoreMessage = $('#scoreMessage');

let scoreMessages = ['Rất tệ', 'Tệ', 'Ổn', 'Khá tốt', 'Tuyệt vời'];
const reviewForm = $('#reviewForm');

function setActionReviewFrom(action, score, message) {
  reviewForm.attr('action', action);
  if (score || message) {
    reviewForm.get(0).score.value = score;
    reviewForm.get(0).message.value = message;
    scoreMessage.text(scoreMessages[score - 1]);
    for (let i = 0; i < 5; i++) {
      stars.eq(i).removeClass('checked');
    }

    for (let i = 0; i < score; i++) {
      stars.eq(i).addClass('checked');
    }
  }
}
