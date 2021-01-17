const form = $('#sign-up-form');
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const emailInput = $('#email');
const passwordInput = $('#password');
const reTypePasswordInput = $('#retype-password');
const emailValidate = $('#email-validate');
let emailCheck = false;

function validateEmail(email) {
  return emailRegex.test(email);
}

$('input[name="email"]').change(function () {
  const email = $(this).val();
  if (emailRegex.test(email)) {
    emailCheck = false;
    fetch(`/verify-email?email=${email}`)
      .then((res) => res.json())
      .then((isAvailable) => {
        if (isAvailable) {
          emailValidate.addClass('text-success');
          emailValidate.removeClass('text-danger');
          emailValidate.text('Email có sẵn');
          emailCheck = true;
        } else {
          emailValidate.removeClass('text-success');
          emailValidate.addClass('text-danger');
          emailValidate.text('Email đã được sử dụng');
          emailCheck = false;
        }
      });
  } else {
    emailValidate.removeClass('text-success');
    emailValidate.removeClass('text-danger');
    emailValidate.text('');
    emailCheck = false;
  }
});

function validateForm() {
  if (!validateEmail(emailInput.val())) {
    emailValidate.removeClass('text-success');
    emailValidate.addClass('text-danger');
    emailValidate.text('Email không hợp lệ');
    return false;
  }

  if (!emailCheck) {
    return false;
  }

  if (reTypePasswordInput.val() !== passwordInput.val()) {
    $('#password-validate').text('Mật khẩu không khớp');
    return false;
  }
  return true;
}
