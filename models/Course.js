const mongoose = require('mongoose');
const fileService = require('../services/fileService');
const { removeAccent } = require('../services/language');

const schema = mongoose.Schema({
  name: String,
  nonAccentedName: String,
  avatar: { path: String, publicId: String },
  shortDescription: String,
  description: String,
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'SubCategory',
  },
  price: Number,
  discount: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lecturer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  sections: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Section',
    },
  ],
  viewCount: {
    type: Number,
    default: 0,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

schema.pre('updateOne', function (next) {
  if (this._update.name) this._update.nonAccentedName = removeAccent(this._update.name);
  next();
});

schema.pre('save', function (next) {
  this.nonAccentedName = removeAccent(this.name);
  next();
});

schema.pre('deleteOne', async function (next) {
  try {
    const course = await mongoose.model('Course').findOne(this._conditions);
    const fileDestroy = fileService.destroy(course.avatar.publicId, { invalidate: true, resource_type: 'image' });
    const sectionsDelete = mongoose.model('Section').deleteMany({ _id: { $in: course.sections } });
    const reviewDelete = mongoose.model('Review').deleteMany({ _id: { $in: course.reviews } });
    const invoiceDelete = mongoose.model('Invoice').deleteMany({ course: course._id });

    await fileDestroy;
    await sectionsDelete;
    await reviewDelete;
    await invoiceDelete;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

schema.statics.getFeatureCourses = function (limit, cb) {
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

schema.statics.getMostViewCourses = function (limit, cb) {
  const query = this;
  query.aggregate(
    [
      {
        $project: {
          name: 1,
          avatar: 1,
          price: 1,
          discount: 1,
          lecturer: 1,
          viewCount: 1,
        },
      },
      {
        $sort: {
          viewCount: -1,
        },
      },
      {
        $limit: limit,
      },
    ],
    (err, courses) => {
      if (err) {
        return cb(err, courses);
      }

      query.populate(courses, 'lecturer', (err, courses) => {
        courses.forEach((course) => {
          course.lecturerName = course.lecturer.fullName;
          course.lecturer = null;
        });
        cb(err, courses);
      });
    }
  );
};

schema.statics.getCourseDetail = function (id, cb) {
  mongoose
    .model('Course')
    .findById(id)
    .populate('lecturer')
    .populate({
      path: 'sections',
      populate: {
        path: 'lectures',
      },
    })
    .populate({
      path: 'reviews',
      populate: {
        path: 'writer',
      },
    })
    .exec((err, course) => {
      let rating = 0;
      if (course.reviews.length !== 0) {
        course.reviews.forEach((review) => {
          rating += review.score;
        });
        rating /= course.reviews.length;
      }
      course.rating = rating;
      cb(err, course);
    });
};

schema.statics.getMultipleCourseDetail = function (condition, skip, limit, sort, cb) {
  let sortOption = { name: 1 };
  if (sort === 'price') {
    sortOption = { price: 1 };
  } else if (sort === 'rating') {
    sortOption = { rating: -1 };
  }

  mongoose
    .model('Course')
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          reviews: 1,
          lecturer: 1,
          sections: 1,
          price: 1,
          category: 1,
          studentCount: 1,
          rating: { $avg: '$reviews.score' },
        },
      },
      {
        $sort: sortOption,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lecturer',
          foreignField: '_id',
          as: 'lecturer',
        },
      },
      {
        $unwind: {
          path: '$lecturer',
        },
      },
      {
        $lookup: {
          from: 'sections',
          localField: 'sections',
          foreignField: '_id',
          as: 'sections',
        },
      },
    ])
    .exec((err, courses) => {
      if (err) {
        console.log(err);
      }
      cb(err, courses);
    });
};

schema.statics.getLecture = function (courseId, sectionNo, lectureNo, cb) {
  //Only populate require field, so the query will be more efficient
  this.findById(courseId).exec((err, course) => {
    if (err || !course) {
      cb(new Error('Find error'));
    } else if (sectionNo < 0 || sectionNo >= course.sections.length) {
      cb(new Error('Invalid sectionNo'));
    } else {
      Section.findById(course.sections[sectionNo], (err, section) => {
        if (err || !course) {
          cb(new Error('Find error'));
        } else if (lectureNo < 0 || lectureNo >= section.lectures.length) {
          cb(new Error('Invalid lectureNo'));
        } else {
          Lecture.findById(section.lectures[lectureNo], (err, lecture) => {
            cb(err, lecture);
          });
        }
      });
    }
  });
};

schema.index({ nonAccentedName: 'text' });

module.exports = mongoose.model('Course', schema);
