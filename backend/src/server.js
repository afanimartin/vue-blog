require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

// SETUP PORT
const connUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = process.env.PORT || 3000;

// CREATE APP
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SETUP DATABASE
// configure mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.connect(connUri, { useNewUrlParser: true});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB connection established successfully")
);
connection.on("error", (err) => {
  console.log("There is an error in the database connection " + err);
  process.exit();
});

// INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize())
require('./middlewares/jwt')(passport)

// CONFIGURE ROUTES
require('./routes/index')(app)

// START SERVER
app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
