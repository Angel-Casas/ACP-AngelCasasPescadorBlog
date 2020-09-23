const passport =  require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/userSchema");

class passportManager {
  initialize() {
    var opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    }
    passport.use(new Strategy(opts, function(jwt_payload, done) {
      User.findOne({ id: jwt_payload.id }, function(err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    }));
    return passport.initialize();
  }
  authenticate(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        if (info.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Your token has expired." });
        } else {
          return res.status(401).json({ message: info.message });
        }
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
}

module.exports = new passportManager();