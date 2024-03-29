const auth = require("./auth");
const user = require("./user");

const authenticate = require("../middlewares/authenticate");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to Vuejs Blog App" });
  });

  app.use("/api/auth", auth);
  app.use("/api/user", authenticate, user);
};
