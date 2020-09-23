var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: String,
  body: String,
  preview: String,
  titulo: String,
  cuerpo: String,
  previo: String,
  author: { type: String, default: 'Ángel Casas Pescador' },
  section: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  meta: {
    votes: { type: Number, default: 0 },
    favs: { type: Number, default: 0 }
  },
  date: { type: Date, default: Date.now },
  tags: { type: Array, default: [] }
});

// Virtual for post's URL
postSchema.virtual('url').get(function() {
  return 'posts/' + this.section + '/' + this._id;
});

// Virtual for post's Time format
postSchema.virtual('post_time_formatted').get(function() {
  return moment(this.date).format('MMMM Do, YYYY');
});

// Virtual for post's tags list to String
postSchema.virtual('tag_list').get(function() {
  return this.tags.join(' ');
})

// Export model
module.exports = mongoose.model('Post', postSchema);
