const deleteSectionForm = $('#delete-section-form');

function changeAction(e) {
  deleteSectionForm.attr('action', e.dataset.action);
}
