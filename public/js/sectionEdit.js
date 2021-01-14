const editForm = $('#edit-form');
const deleteForm = $('#delete-form');

function setActionForEditForm(id, name, preview) {
  editForm.get(0).name.value = name;
  editForm.get(0).preview.value = Boolean(preview);
  editForm.find('input[type="checkbox"]').prop('checked', Boolean(preview));
  editForm.attr('action', `sections/${id}?_method=PUT`);
}

function setActionForDeleteForm(id) {
  deleteForm.attr('action', `sections/${id}?_method=DELETE`);
}

$('input[type="checkbox"]').on('change', function () {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
  } else {
    $(this).attr('value', 'false');
  }
});
