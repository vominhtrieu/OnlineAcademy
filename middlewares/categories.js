const UpperLevelCategory = require("../models/UpperLevelCategory");

module.exports = (req, res, next) => {
    UpperLevelCategory.find({}).populate("lowerLevelCategories").exec((err, categories) => {
        if (err){
            res.send("Err: " + err);
        }
        else {
            res.locals.categories = categories;
            next();
        }
    })
}