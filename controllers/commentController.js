var Comment = require('../models/commentSchema');
var Blog = require('../models/postSchema');
var mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

// Handle post comment on POST

exports.post_comment_post = function(req, res, next) {
  // Validation and Sanitation for POST form request
  console.log("POST COMMENT");

  body('content').isLength({ min: 1})

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('post comment error:' + errors);
    return res.status(422).json({ errors: errors.array() });
  }

  // Find post and add new comment

  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name || undefined,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      console.log("Error saving new comment: " + err);
      return next(err);
    }
    // On success
    console.log('Successfully created comment and saved: ' + comment);
    Blog.findOneAndUpdate({
      _id: req.params.id
    }, {
      "$push": {
        "comments": comment
      }
    }).exec((err, post) => {
      if (err) {
        console.log("Error updating post with comment: " + err);
      }
      if (!post) {
        console.log("Post not found");
        return next(err);
      }
      console.log("Successfully updated post and saved");
      if (req.params.lang === "EN") {
        res.redirect("/EN/" + post.url + "#blog-comments");
      } else {
        res.redirect("/ES/" + post.url + "#blog-comments");
      }
    });
  });
};

// Handle delete comment on POST
exports.delete_comment_post = function(req, res, next) {
  console.log("DELETING COMMENT");
  try {
    Comment.findOneAndDelete({ _id: req.body.id }, function (err, comment) {
      if (err) {
        console.log("Error finding comment: " + err);
        return next(err);
      }
      // On success
      console.log(comment);
      next();
    });
  } catch (err) {
    console.log("Error deleting comment: " + err);
    return next(err);
  }
};

// Approve comment on POST
exports.approve_comment_post = function(req, res, next) {
  console.log("APPROVING COMMENT");
  Comment.findByIdAndUpdate(req.body.id, { approved: true }, function(err, comment) {
    if (err) {
      console.log("Error updating comment: " + err);
      return next(err);
    }
    // On success
    console.log("SUCCESSFULLY APPROVED AND SAVED");
    console.log(comment);
    next();
  });
};