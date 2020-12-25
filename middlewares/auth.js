exports.checkIsStudent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'student') next();
  else {
    req.flash('Bạn không có quyền truy cập trang này');
    res.redirect('/signin');
  }
};

exports.checkIsLecturer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'lecturer') next();
  else {
    req.flash('Bạn không có quyền truy cập trang này');
    res.redirect('/signin');
  }
};

exports.checkIsAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'admin') next();
  else {
    req.flash('Bạn không có quyền truy cập trang này');
    res.redirect('/signin');
  }
};
