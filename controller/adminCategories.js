const mongoose = require('mongoose');
const Course = require('../models/Course');
const MainCategory = require('../models/MainCategory');
const SubCategory = require('../models/SubCategory');

exports.getMainCategoriesView = (req, res) => {
  MainCategory.find({}, (err, categories) => {
    if (err) {
      req.flash('error', 'Không thể lấy danh sách lĩnh vực');
      res.redirect('/');
    } else {
      res.render('admin/mainCategories', {
        categories,
      });
    }
  });
};

exports.addNewMainCategory = (req, res) => {
  if (req.body.categoryName !== '') {
    MainCategory.create(
      {
        name: req.body.categoryName,
      },
      (err, category) => {
        if (err) {
          req.flash('error', 'Không thể thêm lĩnh vực với tên này');
        } else {
          req.flash('info', `Đã thêm lĩnh vực "${category.name}"`);
        }
        res.redirect('/admin/categories');
      }
    );
  } else {
    req.flash('error', 'Tên không thể là rỗng');
    res.redirect('/admin/categories');
  }
};

exports.getSubCategoriesView = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id);

    const subCategories = await Course.aggregate([
      { $group: { _id: '$category', courseCount: { $sum: 1 } } },
      {
        $match: {
          _id: { $in: category.subCategories },
        },
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
    ]).exec();
    console.log(subCategories);
    res.render('admin/subCategories', {
      category,
      subCategories,
    });
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không thể lấy danh sách lĩnh vực');
    res.redirect('back');
  }
};

exports.findCategory = (req, res) => {
  SubCategory.find({ $text: { $search: req.query.q } }, (err, categories) => {
    if (err || !categories) {
      res.json([]);
    } else {
      res.json(categories);
    }
  });
};

exports.updateMainCategory = (req, res) => {
  MainCategory.updateOne(
    { _id: new mongoose.Types.ObjectId(req.params.id) },
    { name: req.body.categoryName },
    (err) => {
      if (err) {
        req.flash('error', 'Không thể chỉnh sửa lĩnh vực này, vui lòng thử lại sau');
        res.redirect('/admin/categories');
      } else {
        req.flash('info', 'Chỉnh sửa thành công');
        res.redirect('/admin/categories');
      }
    }
  );
};

exports.deleteMainCategory = async (req, res) => {
  try {
    const mainCategory = await MainCategory.findById(req.params.id);
    if (mainCategory.subCategories.length > 0) {
      req.flash('error', 'Không thể xóa lĩnh vực chính có chứa lĩnh vực con');
      return res.redirect('/admin/categories');
    }
    await MainCategory.deleteOne({ _id: req.params.id });
    req.flash('info', 'Xóa thành công');
    res.redirect('/admin/categories');
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không thể xóa lĩnh vực này, vui lòng thử lại sau');
    res.redirect('/admin/categories');
  }
};

exports.addNewSubCategory = (req, res) => {
  const { mainId } = req.params;
  if (req.body.categoryName !== '') {
    SubCategory.create(
      {
        name: req.body.categoryName,
      },
      (err, category) => {
        if (err) {
          req.flash('error', 'Không thể thêm lĩnh vực với tên này');
          res.redirect(`/admin/categories/${mainId}`);
        } else {
          MainCategory.updateOne({ _id: mainId }, { $push: { subCategories: category._id } }, (err) => {
            if (err) {
              req.flash('error', 'Không thể thêm lĩnh vực với tên này');
            } else {
              req.flash('info', `Đã thêm lĩnh vực "${category.name}"`);
            }
            res.redirect(`/admin/categories/${mainId}`);
          });
        }
      }
    );
  } else {
    req.flash('error', 'Tên không thể là rỗng');
    res.redirect(`/admin/categories/${mainId}`);
  }
};

exports.updateSubCategory = (req, res) => {
  SubCategory.updateOne(
    { _id: new mongoose.Types.ObjectId(req.params.subId) },
    { name: req.body.categoryName },
    (err) => {
      if (err) {
        req.flash('error', 'Không thể chỉnh sửa lĩnh vực này, vui lòng thử lại sau');
      } else {
        req.flash('info', 'Chỉnh sửa thành công');
      }
      res.redirect(`/admin/categories/${req.params.mainId}`);
    }
  );
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const courses = await Course.find({ category: req.params.subId });
    if (courses.length > 0) {
      req.flash('error', 'Không thể xóa lĩnh vực đã có khóa học');
    } else {
      await SubCategory.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.subId) });
      req.flash('info', 'Xóa thành công');
    }
  } catch (e) {
    req.flash('error', 'Không thể xóa lĩnh vực này, vui lòng thử lại sau');
  } finally {
    res.redirect('back');
  }
};
