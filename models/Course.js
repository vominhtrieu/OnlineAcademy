const mongoose = require('mongoose');
const { removeAccent } = require('../services/language');
const Lecture = require('./Lecture');
const Section = require('./Section');

const schema = mongoose.Schema({
  name: String,
  nonAccentedName: String,
  avatar: String,
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

schema.statics.getFeatureCourses = function (limit, cb) {
  const query = this;
  query
    .find({})
    .sort({ studentCount: -1 })
    .limit(limit)
    .populate('lecturer')
    .exec((err, courses) => {
      courses.forEach((course) => {
        course.lecturerName = course.lecturer.fullName;
        course.lecturer = null;
      });
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
  this.findById(id)
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
