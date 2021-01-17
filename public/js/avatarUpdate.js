const form = $('#avatarForm').get(0);
const avatarInput = $('#avatarInput');

$('#avatarButton').click(function () {
  avatarInput.get(0).click();
});

avatarInput.change(function () {
  form.submit();
});
