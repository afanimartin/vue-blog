const express = require("express");
const router = express.Router();

const Auth = require("../controllers/auth");
const validate = require("../middlewares/validate");

router.get(
  "/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address."),
    check("password").not().isEmpty(),
  ],
  validate,
  Auth.login
);
router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("username").not().isEmpty().withMessage("You username is required"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
  ],
  validate,
  Auth.register
);
