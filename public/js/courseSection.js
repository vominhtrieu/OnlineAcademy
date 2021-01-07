$('.section-content[data-toggle="false"]').toggle();

$('.section-toggler').click(function () {
  const sectionTogglerIcon = $(this).find('>span>i');
  sectionTogglerIcon.toggleClass('fa-chevron-down');
  sectionTogglerIcon.toggleClass('fa-chevron-up');
  $(this).parent().next().slideToggle();
});
