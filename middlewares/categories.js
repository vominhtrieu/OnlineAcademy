const MainCategory = require('../models/MainCategory');

module.exports = (req, res, next) => {
  MainCategory.find({})
    .populate('subCategories')
    .exec((err, categories) => {
      if (err) {
        res.send('Err: ' + err);
      } else {
        res.locals.categories = categories;
        next();
      }
    });
};
