const mongoose = require('mongoose');
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

exports.getSubCategoriesView = (req, res) => {
  MainCategory.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  })
    .populate('subCategories')
    .exec((err, category) => {
      if (err || !category) {
        req.flash('error', 'Không thể lấy danh sách lĩnh vực');
        res.redirect(`/admin/categories/`);
      } else {
        res.render('admin/subCategories', {
          category,
        });
      }
    });
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

exports.deleteMainCategory = (req, res) => {
  MainCategory.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, (err) => {
    if (err) {
      req.flash('error', 'Không thể xóa lĩnh vực này, vui lòng thử lại sau');
      res.redirect('/admin/categories');
    } else {
      req.flash('info', 'Xóa thành công');
      res.redirect('/admin/categories');
    }
  });
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

exports.deleteSubCategory = (req, res) => {
  SubCategory.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.subId) }, (err) => {
    if (err) {
      req.flash('error', 'Không thể xóa lĩnh vực này, vui lòng thử lại sau');
    } else {
      req.flash('info', 'Xóa thành công');
    }
    res.redirect(`/admin/categories/${req.params.mainId}`);
  });
};
