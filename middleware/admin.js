module.exports = function (req, res, next) {
  // If user is authenticated, user model gets added to request object.
  console.log(req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // 403 is forbidden status.
    return res
      .status(403)
      .send({ message: "Only admin users can take this action." });
  }
};