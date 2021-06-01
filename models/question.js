const mongoose = require("mongoose");
const { Schema } = mongoose;
// Question Schema
const Questions_Schema = new Schema({
    questionID: { type: String },
    questionText: { type: String, required: true, unique: true },
    options: { type: Array, required: true },
    marks: { type: Number, required: true },
    difficultyLevel: { type: Number },
    questionType: { type: String, required: true },
    correctOptions: { type: Array, required: true },
    topics:  { type: Array, required: true },
    tags:  { type: Array, required: true },
    addedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: null }

});

module.exports = mongoose.model("questions", Questions_Schema);