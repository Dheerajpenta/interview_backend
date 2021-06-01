var mongoose = require("mongoose");

var skillSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    skillName: { type: String, required: true, unique: true}
});

module.exports = mongoose.model("skill", skillSchema);
