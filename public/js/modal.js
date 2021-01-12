$('button[data-toggle="modal"]').click(function () {
  const target = $(this).attr('data-target');
  const form = $(target).find('form');
  const action = $(this).attr('data-action');
  form.attr('action', action);

  const name = $(this).attr('data-name');
  const videoPath = $(this).attr('data-video-path');
  const videoExtension = $(this).attr('data-video-extension');
  if (name) {
    $(target).find('.modal-title').text('Sửa nội dung bài giảng');
    $(target).find('button[type="submit"]').text('Chỉnh sửa');
    form.get(0).name.value = name;

    videojs('video-preview').src({
      type: `video/${videoExtension}`,
      src: `/videos/${videoPath}`,
    });
  } else {
    $(target).find('.modal-title').text('Thêm bài giảng');
    $(target).find('button[type="submit"]').text('Thêm');
  }
});
