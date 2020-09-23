module.exports = (req, res ,next) => {
  console.log("AUTHENTICATING");
  console.log(req.session.user);
  if (req.session.user) {
    if (req.session.user.role === "admin") {
      next();
    } else {
      var err = new Error("Not admin!");
      console.log(req.session.user);
      next(err);
    }
  } else {
    var err = new Error("Not logged in!");
    console.log(req.session.user);
    next(err);
  }
};