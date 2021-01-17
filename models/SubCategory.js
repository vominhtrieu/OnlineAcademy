const mongoose = require('mongoose');
const language = require('../services/language');

const schema = mongoose.Schema({
  name: String,
  nonAccentedName: String,
  image: String,
});

schema.pre('save', function () {
  this.nonAccentedName = language.removeAccent(this.name);
});

schema.pre('updateOne', function () {
  this._update.nonAccentedName = language.removeAccent(this._update.name);
});

schema.index({ nonAccentedName: 'text' });

schema.statics.getMostEnrolledCategories = function (limit, cb) {
  const current = new Date();
  current.setDate(current.getDate() - 7);
  mongoose
    .model('Invoice')
    .aggregate([
      { $match: { date: { $gte: current } } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $group: { _id: '$course.category', count: { $sum: '$count' } },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
    ])
    .exec((err, categories) => {
      cb(err, categories);
    });
};

module.exports = mongoose.model('SubCategory', schema);
