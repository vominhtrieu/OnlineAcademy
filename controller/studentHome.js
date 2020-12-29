exports.getHomeView = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    res.redirect('/admin');
  } else res.render('student/home');
};
