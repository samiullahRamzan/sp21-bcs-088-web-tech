const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// npm uninstall express-flash-message
//const { flash } = require('express-flash-message');

// npm install connect-flash
const session = require("express-session");

const app = express();
const port = process.env.PORT || 7500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
// Static Files
app.use(express.static("public"));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use(require("./midleware/siteSetting"));
app.use(require("./midleware/calculate"));
// Routes
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/customer"));

//Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`App listeing on port ${port}`);
});

const MONGODBURL =
  "mongodb+srv://samiramzan0044:KmnyRYih8v9ByNBc@cluster0.a9bb9eh.mongodb.net/Customer";
mongoose
  .connect(MONGODBURL, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo ...."))
  .catch((error) => console.log(error.message));
