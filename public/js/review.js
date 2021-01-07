const stars = $('.fa-star');
const scoreInput = $('#scoreInput');
const scoreMessage = $('#scoreMessage');

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

tinymce.init({
  selector: '#reviewMessage',
  menubar: false,
  toolbar:
    'undo redo | bold italic underline | fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent',
  plugins: 'advlist link image lists',
  resize: false,
  height: 200,
  content_style: '/css/editor.css',
});
