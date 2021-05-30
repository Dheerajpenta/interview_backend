var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  test_id: mongoose.Schema.Types.ObjectId,
  Questions_id: { type: [String], },
  Name: { type: String, required: true, unique: true},
  Role: { type: String, required: true},
  Duration: { type: String, required: true},
  Description: { type: String, required: true, unique: true},
  Expires_at: { type: String, required: true, unique: true},
  Status: { type: String, required: true, unique: true}
});

module.exports = mongoose.model('Test', testSchema)
