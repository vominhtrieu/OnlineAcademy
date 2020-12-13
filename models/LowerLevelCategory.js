const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: String,
    image: String,
    courses: [mongoose.Types.ObjectId],
});

module.exports = mongoose.model("LowerLevelCategory", schema);