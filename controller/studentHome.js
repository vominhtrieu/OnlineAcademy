exports.getHomeView = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    res.redirect('/admin');
  } else if (req.user && req.user.role === 'lecturer') {
    res.redirect('/lecturer');
  } else res.render('student/home');
};
