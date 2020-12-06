var express = require("express");
var router = express.Router();

// Require controller modules
var postController = require("../controllers/postController");
var commentController = require("../controllers/commentController");
var bookController = require("../controllers/bookController");
var userController = require("../controllers/userController");
const authorization = require("../middleware/authorization");

// Home page route.
router.get("/", function (req, res) {
  res.redirect("/ES");
});
router.get("/:lang", postController.index);

// About page route
router.get("/:lang/about", postController.about_section_get);

// Projects page route
router.get("/:lang/projects", postController.projects_section_get);

// Photography page route
router.get("/:lang/photography", postController.photography_section_get);

// POST ROUTES

// GET request for posts list landing page
router.get("/:lang/posts", postController.post_list);

// GET request for post section landing page
router.get("/:lang/posts/:section", postController.post_section_list);

// GET request for post tags landing page
router.get("/:lang/tags/:tag", postController.post_tag_list);

// GET request for post instance
router.get("/:lang/posts/:section/:id", postController.post_instance);

// POST request for post comment
router.post(
  "/:lang/posts/:section/:id/comment",
  commentController.post_comment_post
);

// POST request for deleting comment
router.post(
  "/:lang/posts/:section/:id/delete_comment",
  authorization,
  commentController.delete_comment_post
);

// POST request for approving comment
router.post(
  "/:lang/posts/:section/:id/approve",
  authorization,
  commentController.approve_comment_post
);

// GET request for creating post PRIVATE
router.get("/:lang/new", authorization, postController.post_create_get);

// POST request for creating post PRIVATE
router.post("/:lang/new", authorization, postController.post_create_post);

// GET request for editing post PRIVATE
router.get(
  "/:lang/posts/:section/:id/edit",
  authorization,
  postController.post_edit_get
);

// POST request for editing post PRIVATE
router.post(
  "/:lang/posts/:section/:id/edit",
  authorization,
  postController.post_edit_post
);

// GET request for deleting post PRIVATE
router.get(
  "/:lang/posts/:section/:id/delete",
  authorization,
  postController.post_delete_get
);

// POST request for deleting post PRIVATE
router.post(
  "/:lang/posts/:section/:id/delete",
  authorization,
  postController.post_delete_post
);

// POST request for changing post from preview to published
router.post(
  "/:lang/posts/:section/:id/publish",
  authorization,
  postController.switch_preview2full_post
);

// BOOKS ROUTES

// GET request for books list landing page
router.get("/:lang/books", bookController.books_list);

// GET request for books create
router.get("/books/create", bookController.books_create_get);

// POST request for books create
router.post("/books/create", bookController.books_create_post);

// GET request for subscription confirmed page
router.get("/:lang/subscription_confirmed", function (req, res) {
  if (req.params.lang === "EN") {
    res.render("subscription_confirmed-EN.pug");
  } else {
    res.render("subscription_confirmed-EN.pug");
  }
});

// USER ROUTES

// GET request for login page
router.get("/:lang/login", userController.login_form_get);

// POST request for login page
router.post("/:lang/login", userController.login_form_post);

// GET request for register page
router.get("/:lang/register", userController.register_form_get);

// POST request for register page
router.post("/:lang/register", userController.register_form_post);

// GET request for logout
router.get("/:lang/logout", userController.logout);

// PRIVACY POLICY

// GET request for privacy policy page
router.get("/:lang/privacy-policy", postController.privacy_get);

// ERROR ROUTES

// 404 NOT FOUND
router.get("/404", function (req, res) {
  if (req.params.lang === "EN") {
    res.render("not_found-EN");
  } else {
    res.render("not_found-ES");
  }
});

// 403 FORBIDDEN
router.get("/403", function (req, res) {
  if (req.params.lang === "EN") {
    res.render("forbidden-EN");
  } else {
    res.render("forbidden-ES");
  }
});

// 500 INTERNAL SERVER ERROR
router.get("/500", function (req, res) {
  if (req.params.lang === "EN") {
    res.render("internal_server_error-EN");
  } else {
    res.render("internal_server_error-ES");
  }
});

module.exports = router;
