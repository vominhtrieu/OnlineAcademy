const mongoose = require('mongoose');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');
const SubCategory = require('../models/SubCategory');

const updateCourseDate = async (courseId) => {
  await Course.updateOne({ _id: courseId }, { lastUpdate: Date.now() });
};

exports.getAddNewCourseView = (_req, res) => {
  res.render('lecturer/newCourse');
};

exports.getCourseDetailView = (req, res) => {
  Course.getCourseDetail(req.params.courseId, (err, course) => {
    if (err || !course) {
      req.flash('error', `Không tìm thấy khóa học với id là ${req.params.courseId}`);
      res.redirect('/lecturer');
    } else {
      res.render('lecturer/courseDetail', { course });
    }
  });
};

exports.getCourseEditorView = (req, res) => {
  Course.findById(req.params.courseId)
    .populate('category')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.courseId}`);
        res.redirect('/lecturer');
      } else {
        res.render('lecturer/courseEditor', { course });
      }
    });
};

exports.deleteSection = async (req, res) => {
  try {
    await Section.deleteOne({ _id: req.params.sectionId });
    updateCourseDate(req.params.courseId);
    req.flash('info', 'Đã xóa chương');
  } catch (e) {
    console.log(e);
    req.flash('error', 'Xảy ra lỗi khi xóa chương');
  }
  res.redirect(`back`);
};

exports.getSectionsView = (req, res) => {
  Course.findById(req.params.courseId)
    .populate('sections')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.courseId}`);
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
        req.flash('error', `Không tìm thấy chương với id là ${req.params.courseId}`);
        res.redirect(`/lecturer/course/${req.params.courseId}/sections`);
      } else {
        res.render('lecturer/courseSection', { section, courseId: req.params.courseId });
      }
    });
};

exports.addNewSection = (req, res) => {
  Section.create({ name: req.body.name, preview: req.body.preview }, (err, section) => {
    if (err) {
      req.flash('error', 'Không thể thêm chương này');
      return res.redirect(`/lecturer/course/${req.params.courseId}/sections`);
    }
    Course.updateOne(
      { _id: req.params.courseId, lecturer: req.user._id },
      {
        $push: {
          sections: section._id,
        },
      },
      (err, course) => {
        if (err || !course) {
          req.flash('error', 'Không thể thêm chương này');
        } else {
          updateCourseDate(req.params.courseId);
          req.flash('info', `Đã thêm chương ${section.name}`);
        }
        res.redirect(`/lecturer/course/${req.params.courseId}/sections`);
      }
    );
  });
};

exports.updateSection = async (req, res) => {
  try {
    console.log(req.body.preview);
    await Section.updateOne(
      { _id: req.params.sectionId },
      { name: req.body.name, preview: req.body.preview === 'true' }
    );
    updateCourseDate(req.params.courseId);
    req.flash('info', 'Đã cập nhật chương');
  } catch (e) {
    console.log(e);
    req.flash('error', 'Lỗi khi cập nhật tên chương');
  } finally {
    res.redirect('back');
  }
};

exports.addNewCourse = async (req, res) => {
  try {
    const category = await SubCategory.findById(new mongoose.Types.ObjectId(req.body.category));
    await Course.create({
      name: req.body.name,
      avatar: req.file.filename,
      category: category._id,
      view: 0,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      price: req.body.price,
      lecturer: req.user._id,
    });
    req.flash('info', 'Đã thêm khóa học thành công');
  } catch (e) {
    req.flash('error', 'Không thể thêm khóa học này');
  } finally {
    res.redirect('/lecturer');
  }
};

exports.addNewLecture = async (req, res) => {
  try {
    const ext = req.file.originalname.split('.').pop();

    const lecture = await Lecture.create({
      name: req.body.name,
      video: { path: req.file.filename, extension: ext },
    });

    await Section.updateOne(
      { _id: req.params.sectionId },
      {
        $push: {
          lectures: lecture._id,
        },
      }
    );
    updateCourseDate(req.params.courseId);
    req.flash('info', `Đã thêm bài giảng ${lecture.name}`);
  } catch (e) {
    req.flash('error', 'Không thể thêm bài giảng này');
  } finally {
    res.redirect('back');
  }
};

exports.updateLecture = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.video = {
        path: req.file.filename,
        extension: req.file.originalname.split('.').pop(),
      };
    }

    await Lecture.updateOne({ _id: req.params.lectureId }, updateData);
    updateCourseDate(req.params.courseId);
    req.flash('info', `Đã chỉnh sửa bài giảng`);
  } catch (e) {
    req.flash('error', 'Không thể chỉnh sửa bài giảng này');
  } finally {
    res.redirect('back');
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    await Section.updateOne({ _id: req.params.sectionId }, { $pull: { lectures: req.params.lectureId } });
    await Lecture.deleteOne({ _id: req.params.lectureId });
    updateCourseDate(req.params.courseId);
    req.flash('info', `Đã xóa bài giảng`);
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không thể xoá bài giảng này');
  } finally {
    res.redirect('back');
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: +req.body.price,
      discount: req.body.discount,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
    };
    if (req.file) {
      updateData.avatar = req.file.filename;
    }
    await Course.updateOne({ _id: req.params.courseId, lecturer: req.user._id }, updateData);
    updateCourseDate(req.params.courseId);
    req.flash('info', 'Chỉnh sửa khóa học thành công');
  } catch (e) {
    req.flash('error', 'Không thể chỉnh sửa khóa học này');
  } finally {
    res.redirect(`/lecturer/course/${req.params.courseId}`);
  }
};

exports.toggleComplete = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    await Course.updateOne({ _id: req.params.courseId, lecturer: req.user._id }, { completed: !course.completed });
    updateCourseDate(req.params.courseId);
    req.flash('info', 'Đã cập nhật tình trạng khóa học');
    res.redirect('back');
  } catch (e) {
    console.log(e);
    req.flash('info', 'Không thể cập nhật tình trạng khóa học');
    res.redirect('back');
  }
};

exports.deleteCourse = (req, res) => {
  Course.deleteOne({ _id: req.params.courseId, lecturer: req.user._id }, (err) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Không thể xóa khóa học này');
      res.redirect(`/lecturer/course/${req.params.courseId}`);
    } else {
      req.flash('info', 'Xóa khóa học thành công');
      res.redirect('/lecturer');
    }
  });
};
