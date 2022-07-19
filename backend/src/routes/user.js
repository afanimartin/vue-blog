const express = require("express");
const router = express.Router();
const User = require("../controllers/user");

router.route("/").get(User.index);

router
  .route("/:id")
  .get(User.show)
  .patch(User.update)
  .post(User.upload)
  .delete(User.delete);

module.exports = router;
