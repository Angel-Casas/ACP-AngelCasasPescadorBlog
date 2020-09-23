const UserSchema = require("../models/userSchema");

module.exports = async (req, res ,next) => {
  // next is a function that allows asynchronous code in middleware
  let token;
  console.log(req.header);
  try {
    token = req.header("authorization").split(" ")[1];
  } catch (err) {
    // 401 = Unauthorised
    return res.status(401).send({ message: "Authorization token invalid." });
  }
  try {
    req.user = await UserSchema.findByToken(token);
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};