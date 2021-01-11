const mongoose = require('mongoose');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');
const SubCategory = require('../models/SubCategory');
const fileService = require('../services/fileService');

exports.getAddNewCourseView = (_req, res) => {
  res.render('lecturer/newCourse');
};

exports.getCourseDetailView = (req, res) => {
  Course.getCourseDetail(req.params.id, (err, course) => {
    if (err || !course) {
      req.flash('error', `Không tìm thấy khóa học với id là ${req.params.id}`);
      res.redirect('/lecturer');
    } else {
      res.render('lecturer/courseDetail', { course });
    }
  });
};

exports.getCourseEditorView = (req, res) => {
  Course.findById(req.params.id)
    .populate('category')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.id}`);
        res.redirect('/lecturer');
      } else {
        res.render('lecturer/courseEditor', { course });
      }
    });
};

exports.deleteSection = async (req, res) => {
  try {
    await Section.deleteOne({ _id: req.params.sectionId });
    req.flash('Đã xóa chương');
  } catch (e) {
    req.flash('Xảy ra lỗi khi xóa chương');
  }
  res.redirect(`/course/${req.params.courseId}`);
};

exports.getSectionsView = (req, res) => {
  Course.findById(req.params.id)
    .populate('sections')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.id}`);
        res.redirect('/lecturer');
      } else {
        res.render('lecturer/courseSections', { course });
      }
    });
};

exports.getSectionView = (req, res) => {
  Section.findById(mongoose.Types.ObjectId(req.params.sectionId))
    .populate('lectures')
    .exec((err, section) => {
      if (err || !section) {
        console.log(err);
        req.flash('error', `Không tìm thấy chương với id là ${req.params.id}`);
        res.redirect(`/lecturer/course/${req.params.courseId}/sections`);
      } else {
        res.render('lecturer/courseSection', { section });
      }
    });
};

exports.addNewCourse = (req, res) => {
  SubCategory.findById(new mongoose.Types.ObjectId(req.body.category), async (err, category) => {
    if (err || !category) {
      req.flash('error', 'Không thể thêm khóa học này');
      res.redirect('/lecturer');
    } else {
      fileService.uploadImage(req.file, (err, image) => {
        if (err || !image) {
          req.flash('error', 'Không thể thêm khóa học này');
          return res.redirect('/lecturer');
        }

        Course.create(
          {
            name: req.body.name,
            avatar: {
              path: image.secure_url,
              publicId: image.public_id,
            },
            category: category._id,
            view: 0,
            shortDescription: req.body.shortDescription,
            description: req.body.description,
            price: req.body.price,
            lecturer: req.user._id,
          },
          (err) => {
            if (err) {
              console.log(err);
              req.flash('error', 'Không thể thêm khóa học này');
            } else {
              req.flash('info', 'Đã thêm khóa học thành công');
            }
            res.redirect('/lecturer');
          }
        );
      });
    }
  });
};

exports.addNewSection = (req, res) => {
  console.log(req.body);
  //Find course by its id and check if its lecturer is current user
  Section.create({ name: req.body.name }, (err, section) => {
    if (err) {
      req.flash('error', 'Không thể thêm chương này');
      return res.redirect(`/lecturer/course/${req.params.id}/sections`);
    }
    Course.updateOne(
      { _id: req.params.id, lecturer: req.user._id },
      {
        $push: {
          sections: section._id,
        },
      },
      (err, course) => {
        if (err || !course) {
          req.flash('error', 'Không thể thêm chương này');
        } else {
          req.flash('info', `Đã thêm chương ${section.name}`);
        }
        res.redirect(`/lecturer/course/${req.params.id}/sections`);
      }
    );
  });
};

exports.addNewLecture = (req, res) => {
  function handleError() {
    req.flash('error', 'Không thể thêm bài giảng này');
    return res.redirect(`/lecturer/course/${req.params.courseId}/sections/${req.params.sectionId}`);
  }
  if (!req.file) {
    handleError();
    return;
  }

  const ext = req.file.originalname.split('.').pop();
  if (!ext) {
    handleError();
    return;
  }

  fileService.uploadVideo(req.file, (err, video) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Timeout');
      res.redirect('back');
      return;
    }
    Lecture.create(
      {
        name: req.body.name,
        video: { path: video.secure_url, publicId: video.public_id, extension: ext },
      },
      (err, lecture) => {
        if (err) {
          handleError();
          return;
        }
        Section.updateOne(
          { _id: req.params.sectionId },
          {
            $push: {
              lectures: lecture._id,
            },
          },
          (err) => {
            if (err) {
              req.flash('error', 'Không thể thêm bài giảng này');
            } else {
              req.flash('info', `Đã thêm bài giảng ${lecture.name}`);
            }
            res.redirect(`/lecturer/course/${req.params.courseId}/sections/${req.params.sectionId}`);
          }
        );
      }
    );
  });
};

exports.updateCourse = async (req, res) => {
  try {
    console.log(req.body);
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: +req.body.price,
      discount: req.body.discount,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
    };
    if (req.file) {
      const image = await fileService.uploadImage(req.file);
      updateData.avatar = { path: image.secure_url, publicId: image.public_id };
    }
    await Course.updateOne({ _id: req.params.id, lecturer: req.user._id }, updateData);
    req.flash('info', 'Chỉnh sửa khóa học thành công');
  } catch (e) {
    req.flash('error', 'Không thể chỉnh sửa khóa học này');
  } finally {
    res.redirect('back');
  }
};

exports.deleteCourse = (req, res) => {
  Course.deleteOne({ _id: req.params.id, lecturer: req.user._id }, (err) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Không thể xóa khóa học này');
      res.redirect(`/lecturer/course/${req.params.id}`);
    } else {
      req.flash('info', 'Xóa khóa học thành công');
      res.redirect('/lecturer');
    }
  });
};
