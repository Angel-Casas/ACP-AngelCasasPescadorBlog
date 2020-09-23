var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  name: { type: String, default: "Annonymous"},
  content: String,
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  reply: String
});

// Export model
module.exports = mongoose.model('Comment', commentSchema);
