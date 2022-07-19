const User = require("../models/user");

// @route POST api/auth/register
// @desc Register user and return JWT
// @access Public

exports.register = async (req, res) => {
  try {
    const email = req.body.email;
    const userToSave = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (user)
      return res.status(401).json({
        message: "The email entered is associated with another account.",
      });

    // create and save user
    const newUser = new User(userToSave);
    newUser.save();

    return res
      .status(201)
      .json({ token: newUser.generateJWT(), user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route api/auth/login
// @desc Login user and return JWT
// @access Public

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user)
        return res.status(401).json({
          message:
            "The email address " +
            email +
            " is not associated with any account. Please register for an account then try again.",
        });

      // Validate password
      if (!user.comparePassword(password))
        return res.status(401).json({ message: "Invalid password." });

      // Send token with user object
      return res.status(200).json({ token: user.generateJWT(), user: user });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};
