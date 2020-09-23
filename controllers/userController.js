const userSchema = require('../models/userSchema');

// Display login form.
exports.login_form_get = function(req, res) {
  if (req.params.lang === 'EN') {
    res.render('login-EN');
  } else {
    res.render('login-ES');
  }
};

// Handle login form on POST.

exports.login_form_post = async (req, res, next) => {
  console.log("LOGGING IN");
  const { email, password } = req.body;
  try {
    const user = await userSchema.findByCredentials(email, password);

    req.session.user = user;
    console.log(req.session.user);

    if (req.params.lang === "EN") {
      res.redirect("/EN");
    } else {
      res.redirect("/ES");
    }
  } catch (err) {
    if (req.params.lang === "EN") {
      console.log(err);
      res.render("login-EN", { errors: err.errors });
    } else {
      console.log(err);
      res.render("login-ES", { errors: err.errors });
    }
  }
};

// Handle logout on GET.
exports.logout = async (req, res, next) => {
  console.log("LOGGING OUT");
  try {
    req.session.destroy(function() {
      console.log("Logged out");
      console.log(req.session);
    });
    // await req.user.removeToken(req.token);
    if (req.params.lang === "EN") {
      res.redirect("/EN");
    } else {
      res.redirect("/ES");
    }
  } catch (err) {
    res.render("/500");
  }
};

// Display register form.
exports.register_form_get = function(req, res) {
  if (req.params.lang === 'EN') {
    res.render('register-EN');
  } else {
    res.render('register-ES');
  }
};

// Handle register form on POST.
exports.register_form_post = async (req, res) => {
  console.log("CREATING NEW USER");
  const { name, email, password } = req.body;
  const user = new userSchema({ name, email, password });
  try {
    const doc = await user.save();
    req.session.user = user;
    // const token = await doc.generateAuthToken();
    // res
    // .header("authorization", `Bearer ${token}`);
    if (req.params.lang === "EN") {
      res.redirect("/EN");
    } else {
      res.redirect("/ES");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.read = async (req, res) => res.send(req.user);