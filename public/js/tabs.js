const tabs = $('.nav-tabs a');
const syllabusTab = $('#syllabus-tab');
const reviewTab = $('#review-tab');

reviewTab.hide();
tabs.click(function () {
  const tab = +$(this).attr('data-tab');
  console.log(tab);
  if (tab === 0) {
    console.log(1);
    tabs.eq(1).removeClass('active');
    tabs.eq(0).addClass('active');
    syllabusTab.show();
    reviewTab.hide();
  } else {
    console.log(2);
    tabs.eq(0).removeClass('active');
    tabs.eq(1).addClass('active');
    reviewTab.show();
    syllabusTab.hide();
  }
});
