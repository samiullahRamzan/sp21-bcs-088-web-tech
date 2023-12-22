const bcrypt = require("bcryptjs");
const User = require("../models/user");
const express = require("express");
const AuthRoutes = express.Router();
// it is for authentication

AuthRoutes.get("/logout", async (req, res) => {
  req.session.user = null;
  req.session.flash = { type: "info", message: "Logged Out" };
  console.log("session clear");
  return res.redirect("/login");
});

AuthRoutes.get("/login", (req, res) => {
  res.render("auth/login");
});
AuthRoutes.get("/register", (req, res) => {
  res.render("auth/register");
});

AuthRoutes.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.session.flash = {
      type: "danger",
      message: "User with this email is not present",
    };
    return res.redirect("auth/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.session.flash = { type: "success", message: "Logged in Successfully" };
    console.log(req.session.flash);
    return res.redirect("/");
  } else {
    req.session.flash = { type: "danger", message: "Invalid Password" };
    return res.redirect("/login");
  }
});

AuthRoutes.post("/register", async (req, res) => {
  // handle mongodb error for duplicate key error
  let userEmail = await User.findOne({ email: req.body.email });
  if (userEmail) {
    req.session.flash = { type: "danger", message: "Duplicate email" };
    return res.redirect("/register");
  }

  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.redirect("/login");
});
module.exports = AuthRoutes;
