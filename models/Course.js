const mongoose = require('mongoose');
const { removeAccent } = require('../services/language');

const schema = mongoose.Schema({
  name: String,
  nonAccentedName: {
    type: String,
    index: true,
  },
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
  view: Number,
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
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Review',
    },
  ],
  students: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

schema.pre('save', function (next) {
  console.log(this);
  this.nonAccentName = removeAccent(this.name);
  next();
});

schema.statics.getFeatureCourses = function (limit, cb) {
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
          studentCount: { $size: '$students' },
        },
      },
      {
        $sort: {
          studentCount: -1,
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
          view: 1,
        },
      },
      {
        $sort: {
          view: -1,
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

module.exports = mongoose.model('Course', schema);
