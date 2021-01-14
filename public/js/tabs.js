const tabs = $('.nav-tabs a');
const syllabusTab = $('#syllabus-tab');
const reviewTab = $('#review-tab');
const lecturerTab = $('#lecturer-tab');

tabs.click(function () {
  const tab = +$(this).attr('data-tab');

  switch (tab) {
    case 0:
      tabs.eq(2).removeClass('active');
      tabs.eq(1).removeClass('active');
      tabs.eq(0).addClass('active');
      syllabusTab.removeClass('d-none');
      reviewTab.addClass('d-none');
      lecturerTab.addClass('d-none');
      break;
    case 1:
      tabs.eq(0).removeClass('active');
      tabs.eq(1).addClass('active');
      tabs.eq(2).removeClass('active');
      reviewTab.removeClass('d-none');
      syllabusTab.addClass('d-none');
      lecturerTab.addClass('d-none');
      break;
    case 2:
      tabs.eq(0).removeClass('active');
      tabs.eq(1).removeClass('active');
      tabs.eq(2).addClass('active');
      reviewTab.addClass('d-none');
      syllabusTab.addClass('d-none');
      lecturerTab.removeClass('d-none');
      break;
  }
});
