var books = require('../models/bookSchema');

// Display list of all book items.
exports.books_list = function(req, res) {
  if (req.params.lang === 'EN') {
    console.log('English');
    res.render('books-EN')
  } else {
    console.log('ESPAÑOL')
    res.render('books-ES');
  }
};

// Handle book create on GET.
exports.books_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Books create');
};

exports.books_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Books post');
}
