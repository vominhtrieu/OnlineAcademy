let stars = $('.fa-star');
let scoreInput = $('#scoreInput');
let scoreMessage = $('#scoreMessage');

let scoreMessages = ['Rất tệ', 'Tệ', 'Ổn', 'Khá tốt', 'Tuyệt vời'];
const reviewForm = $('#reviewForm');
const addLectureForm = $('#addLectureForm');

function setActionReviewForm(action, score, message) {
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

function setActionAddLectureForm(action) {
  addLectureForm.attr('action', action);
}

const videoInput = document.getElementById('video-input');
const videoSelectorToggler = document.getElementById('video-selector-toggler');
const filenameLabel = document.getElementById('file-name-label');
videoInput.addEventListener('change', (e) => {
  if (e.target.files) {
    const file = e.target.files[0];
    const url = window.URL.createObjectURL(file);
    filenameLabel.textContent = file.name;
    videojs('video-preview').src({
      type: `video/${file.name.split('.').pop()}`,
      src: url,
    });
  }
});

videoSelectorToggler.addEventListener('click', (e) => {
  videoInput.click();
});
