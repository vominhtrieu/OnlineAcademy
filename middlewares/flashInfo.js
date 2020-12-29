module.exports = (req, res, next) => {
  res.locals.info = req.flash('info');
  res.locals.error = req.flash('error');
  next();
};
