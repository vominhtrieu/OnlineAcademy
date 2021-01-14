$('.section-content[data-toggle="false"]').toggle();

$('.section-toggler').click(function () {
  const sectionTogglerIcon = $(this).find('>span>i');
  sectionTogglerIcon.toggleClass('fa-chevron-down');
  sectionTogglerIcon.toggleClass('fa-chevron-up');
  $(this).parent().next().slideToggle();
});

const videoPreview = videojs('video-preview');

$('.preview-toggler').click(function () {
  const src = $(this).attr('data-video');
  const type = 'video/' + $(this).attr('data-extension');
  videoPreview.src({ src, type });
});

$('#preview-video-modal').on('hidden.bs.modal', function () {
  videoPreview.pause();
});
