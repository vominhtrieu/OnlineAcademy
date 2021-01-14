const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  image: String,
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

schema.index({ name: 'text' });

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
        $limit: 4,
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
