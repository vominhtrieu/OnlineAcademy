const express = require('express');
const router = express.Router();
const { checkIsAdmin } = require('../middlewares/auth');
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/adminCategories');

//Main Category
router.get('/', checkIsAdmin, flashInfo, controller.getMainCategoriesView);
router.post('/', checkIsAdmin, controller.addNewMainCategory);
router.get('/:id', checkIsAdmin, flashInfo, controller.getSubCategoriesView);
router.put('/:id', checkIsAdmin, controller.updateMainCategory);
router.delete('/:id', checkIsAdmin, controller.deleteMainCategory);

//Sub Category
//router.get('/:mainId/sub/:subId', checkIsAdmin, flashInfo, controller.getSubCategoryView);
router.post('/:mainId/sub/', checkIsAdmin, flashInfo, controller.addNewSubCategory);
router.put('/:mainId/sub/:subId', checkIsAdmin, flashInfo, controller.updateSubCategory);
router.delete('/:mainId/sub/:subId', checkIsAdmin, flashInfo, controller.deleteSubCategory);

module.exports = router;
