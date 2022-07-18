const express = require("express");
const router = express.Router();
const User = require("../controllers/user");

router.route("/").get(User.index);
router.get("/show", User.show);
router.patch("/update", User.update);
router.post("/upload", User.upload);
router.delete("/delete", User.delete);
