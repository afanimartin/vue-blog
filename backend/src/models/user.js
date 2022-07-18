const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: "Your email is required",
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
      max: 100,
    },
    username: {
      type: String,
      unique: true,
      required: "Your username is required",
      max: 100,
    },
    bio: {
      type: String,
      required: false,
      max: 255,
    },
    profileImage: {
      type: String,
      required: false,
      max: 255,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", (next) => {
  const user = this;

  // If user's password is not changed, move on
  // only hash passwords that have been modified
  if (!user.isModified("password")) return next();

  // default number of rounds is 10
  bcrypt.genSalt((err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// Compare password from db and user input
// If both match, login user
UserSchema.methods.comparePassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

// Return the user object with token upon successful login/signup
UserSchema.methods.generateJWT = () => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  let payload = {
    id: this._id,
    email: this.email,
    username: this.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: parseInt(expirationDate.getTime() / 100, 10),
  });
};

mongoose.set("useFindAndModify", false);
module.exports = mongoose.model("Users", UserSchema);
