exports.getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    info: req.flash('info'),
    error: req.flash('error'),
  });
};
