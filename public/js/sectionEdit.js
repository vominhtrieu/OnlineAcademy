const editForm = $('#edit-form');
const deleteForm = $('#delete-form');

function setActionForEditForm(id, name) {
  editForm.get(0).name.value = name;
  editForm.attr('action', `sections/${id}?_method=PUT`);
}

function setActionForDeleteForm(id, name) {
  deleteForm.attr('action', `sections/${id}?_method=DELETE`);
}
