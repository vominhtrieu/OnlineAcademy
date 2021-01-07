exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else {
    req.flash('error', 'Bạn không có quyền truy cập trang này');
    res.redirect('/signin');
  }
};

exports.checkIsStudent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'student') next();
  else {
    req.flash('error', 'Bạn phải thực hiện đăng nhập trước');
    res.redirect('/signin');
  }
};

exports.checkIsLecturer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'lecturer') next();
  else {
    req.flash('error', 'Bạn không có quyền truy cập trang này');
    res.redirect('/signin');
  }
};

exports.checkIsAccepted = (req, res, next) => {
  if (req.user.accepted) {
    next();
  } else {
    res.send('notAccepted');
  }
};

exports.checkIsAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'admin') next();
  else {
    req.flash('error', 'Bạn không có quyền truy cập trang này');
    res.redirect('/signin');
  }
};
