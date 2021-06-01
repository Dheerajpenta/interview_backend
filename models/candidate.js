var mongoose = require("mongoose");

var candidateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: { type: String, required: true, unique: true},
    email: { type: String, required: true},
    mobile_number: { type: String, required: true}
});

module.exports = mongoose.model("Candidate", candidateSchema);
