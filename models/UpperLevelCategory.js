const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: String,
    lowerLevelCategories: [{
        type: mongoose.Types.ObjectId,
        ref: "LowerLevelCategory",
    }],
});

module.exports = mongoose.model("UpperLevelCategory", schema);