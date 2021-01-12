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

schema.statics.getMostEnrolledCategory = function (limit, cb) {
  const current = new Date();
  current.setDate(current.getDate() - 7);
  mongoose
    .model('Invoice')
    .aggregate([
      { $match: { date: { $gte: current } } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: { path: '$course' },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'course.lecturer',
          foreignField: '_id',
          as: 'course.lecturer',
        },
      },
      {
        $unwind: { path: '$course.lecturer' },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'course.reviews',
          foreignField: '_id',
          as: 'course.reviews',
        },
      },
      {
        $unwind: { path: '$course.reviews', preserveNullAndEmptyArrays: true },
      },
    ])
    .exec((err, courses) => {
      cb(err, courses);
    });
};

module.exports = mongoose.model('SubCategory', schema);
