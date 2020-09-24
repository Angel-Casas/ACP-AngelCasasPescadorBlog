var Blog = require('../models/postSchema');
var mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

var debug = require('debug')('posts');


var async = require('async');

// Display index landing page
exports.index = function(req, res) {
  console.log("INDEX");
  var tagArray = [];
  async.series([
    function(callback) {
      Blog.find({},'tags', function(err, posts) {
        if (err) {
          console.log('Error finding all tags: ' + err);
          return next(err);
        }
        // Successful so push tags to array
        posts.forEach((post) => {
          post.tags.forEach((tag) => {
            tagArray.push(tag);
          });
        });
      });
      callback(null);
    },
    function(callback) {
      // GET RANDOM POST
      Blog.countDocuments().exec(function (err, count) {
        if (err) {
          console.log('Error counting Documents: ' + err);
          return next(err);
        }
        //Successful so get a random entry
        var random = Math.floor(Math.random() * count)
        Blog.findOne().
          skip(random).
          exec(function(err, post) {
            if (err) {
              console.log('Error finding random post: ' + err);
              return next(err);
            }
            // Successful so render
            if (req.params.lang === 'EN') {
              res.render('index-EN', { post: post, tags: tagArray, token: res.locals.token });
            } else {
              res.render('index-ES', { post: post, tags: tagArray, token: res.locals.token });
            }
          });
      });
    }
  ]);
};

// Display list of all Posts
exports.post_list = function (req, res, next) {
  Blog.find({}).
    sort({ date: -1 }).
    exec(function(err, list_posts) {
      if (err) {
        console.log('find post list error:' + err);
        return next(err);
      }
      // On success
      res.render('post_list', { title: 'Recent Blog Posts', post_list: list_posts });
    });
};

// Display list of all posts in section
exports.post_section_list = function (req, res, next) {
Blog.find({section: req.params.section.toUpperCase()}).
  sort({ date: -1 }).
  exec(function(err, list_section_posts) {
    if (err) {
      console.log('find post section list error:' + err);
      return next(err);
    }
    // On success
    var translated = '';
    console.log(req.params.section.toUpperCase());
    if (req.params.lang === 'EN') {
      res.render('post_list-EN', {title: req.params.section.toUpperCase(), post_list: list_section_posts});
    } else {
      switch (req.params.section.toUpperCase()) {
        case 'MATHEMATICS':
          translated = 'Matemáticas';
          break;
        case 'CS':
          translated = 'Ciencias de la computación';
          break;
        case 'ECONOMY':
          translated = 'Economía';
          break;
        case 'NATURE':
          translated = 'Naturaleza';
          break;
      }
      res.render('post_list-ES', {title: translated.toUpperCase(), post_list: list_section_posts});
    }
  });
}

// Display list of all posts in specified tag
exports.post_tag_list = function (req, res, next) {
  Blog.find({ tags: req.params.tag }).
    exec(function(err, tag_list) {
      if (err) {
        console.log('find post tag list error:' + err);
        return next(err);
      }
      // On success
      if (req.params.lang === 'EN') {
        res.render('tag_list-EN', { title: req.params.tag, tag_list: tag_list });
      } else {
        res.render('tag_list-ES', { title: req.params.tag, tag_list: tag_list });
      }
    });
}

// Display post instance
exports.post_instance = function(req, res, next) {
  console.log("Display post");
  Blog.find({}, function (err, post_list) {
    if (err) {
      console.log("Error in finding post list: " + err);
      return next(err);
    }
    // On success
    Blog.findById(req.params.id).
      populate("comments").
      exec(function (err, post) {
        if (err) {
          console.log('findById post instance error:' + err);
          return next(err);
        }
        // On success
        if (req.params.lang === 'EN') {
          res.render('post-EN', {title: post.title, post: post, post_list: post_list });
        } else {
          res.render('post-ES', {title: post.title, post: post, post_list: post_list });
        }
      });
  });
}

// handle create post on GET
exports.post_create_get = function(req, res) {
  if (req.params.lang === 'EN') {
    res.render('post_create-EN');
  } else {
    res.render('post_create-ES');
  }
}

// handle create post on POST
exports.post_create_post = [

  // Make sure tags are an array
  (req, res, next) => {
    req.body.tags = req.body.tags.split(' ');
    next();
  },

  // Validate fields
  body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
  body('content').isLength({ min: 1 }).trim().withMessage('Content must be specified.'),
  body('preview').optional().isLength({ min: 1 }).trim().withMessage('Preview must be specified.'),
  body('titulo').isLength({ min: 1 }).trim().withMessage('El titulo debe ser especificado.'),
  body('contenido').isLength({ min: 1 }).trim().withMessage('El contenido debe ser especificado.'),
  body('previa').optional().isLength({ min: 1 }).trim().withMessage('La previa debe ser especificada.'),

  // Sanitize fields
  body('title').escape(),
  body('preview').escape(),
  body('titulo').escape(),
  body('previa').escape(),

  // Process request after validation and sanitization
  async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    try {
      // Create a post object with escaped and trimmed data
      var post = new Blog(
        {
          title: req.body.title,
          body: req.body.content,
          preview: req.body.preview,
          titulo: req.body.titulo,
          cuerpo: req.body.contenido,
          previo: req.body.previa,
          section: req.body.section,
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again  with sanitized values/error messages
        res.render('post_create-EN', { errors: errors.array() });
        return;
      } else {
        // Data form is valid. Add tags and save post
        for (var i = 0; i < req.body.tags.length; i++) {
          const tag = req.body.tags[i];
          post.tags.push(tag);
        };

        await post.save(function (err) {
          if (err) {
            console.log('Error saving new post: ' + err);
            return next(err);
          }
          // Successful so redirect to post
          console.log('New post: ' + post);
          res.redirect(post.url);
        });
      }
    } catch (error) {
      console.log('Error in try statement: ' + error);
    }
  }
];

// Handle post edit on GET
exports.post_edit_get =  function (req, res, next) {
  Blog.findById(req.params.id).
    exec(function(err, post) {
      if (err) {
        console.log("Error for post edit on GET: " + err);
        return next(err);
      }
      // On success
      if (req.params.lang === 'EN') {
        res.render('post_edit-EN', {post: post});
      } else {
        res.render('post_edit-ES', {post: post});
      }
    });
}

// Handle post edit on POST
exports.post_edit_post = [

  // Convert the tags into an array
  (req, res, next) => {
    req.body.tags = req.body.tags.split(' ');
    next();
  },

  // Validate fields
  body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
  body('content').isLength({ min: 1 }).trim().withMessage('Content must be specified.'),
  body('preview').optional().isLength({ min: 1 }).trim().withMessage('Preview must be specified.'),
  body('titulo').isLength({ min: 1 }).trim().withMessage('Titulo must be specified.'),
  body('contenido').isLength({ min: 1 }).trim().withMessage('Contenido must be specified.'),
  body('previa').isLength({ min: 1 }).trim().withMessage('Previa must be specified.'),

  // Sanitize fields
  body('title').escape(),
  body('preview').escape(),
  body('titulo').escape(),
  body('previa').escape(),

  // Process request after validation and sanitization
  async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Data form is valid. Create a post object with escaped and trimmed data
    var post =
      {
        title: req.body.title,
        body: req.body.content,
        preview: req.body.preview,
        titulo: req.body.titulo,
        cuerpo: req.body.contenido,
        previo: req.body.previa,
        section: req.body.section,
        tags: []
      };
    req.body.tags.forEach((tag) => {
      post.tags.push(tag);
      console.log('Pushing ' + tag + ' to post');
    })

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render('post_edit', { errors: errors.array() });
      return;
    } else {
      await Blog.findByIdAndUpdate(req.params.id, post, function(err, item) {
        if (err) {
          console.log('Error updating post: ' + err);
          return next(err);
        }
        // Successful
        console.log('Updated post with new content');
        if (req.params.lang === 'EN') {
          res.redirect('/EN/' + item.url);
        } else {
          res.redirect('/ES/' + item.url);
        }
      });
    }
  }
];

// Handle post delete on GET
exports.post_delete_get = function (req, res, next) {
  Blog.findById(req.params.id, function (err, post) {
    if (err) {
      console.log('Error finding post to delete on GET: ' + err);
      return next(err);
    }
    // On success
    if (req.params.lang === 'EN') {
      res.render('post_delete-EN', { post: post });
    } else {
      res.render('post_delete-ES', { post: post });
    }
  });
};

// Handle post delete on POST
exports.post_delete_post = function (req, res, next) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log('Error deleting post on POST: ' + err);
      return next(err);
    }
    // On success
    if (req.params.lang === 'EN') {
      res.redirect('/EN');
    } else {
      res.redirect('/ES');
    }
  });
};

// Handle about section on GET
exports.about_section_get = function (req, res, next) {
  if (req.params.lang === 'EN') {
    res.render('about-EN');
  } else {
    res.render('about-ES');
  }
}

// Handle projects section on GET
exports.projects_section_get = function (req, res, next) {
  if (req.params.lang === 'EN') {
    res.render('projects-EN');
  } else {
    res.render('projects-ES');
  }
}

// Privacy policy page on GET
exports.privacy_get = function (req, res, next) {
  if (req.params.lang == 'EN') {
    res.render('privacy-policy-EN');
  } else {
    res.render('privacy-policy-ES');
  }
};
