// This middleware is used to authenticate the user's request

const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) return next(err);

    if (!user)
      return res
        .status(401)
        .json({ message: "Unauthorized Access - No token provided!" });

    req.user = user;

    next();
  })(req, res, next);
};
