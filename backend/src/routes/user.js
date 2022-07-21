const express = require("express");
const router = express.Router();
const User = require("../controllers/user");

router.route("/").get(User.index);

router.route("/:id").get(User.show).patch(User.update).delete(User.delete);

module.exports = router;
