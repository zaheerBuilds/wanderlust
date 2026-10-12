const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const WrapAsync = require("../utils/WrapAsync");

// Render the user signup form
router.get(
  "/signup",
  WrapAsync((req, res) => {
    res.render("users/signup.ejs");
  }),
);

// Process the registration form submission
router.post(
  "/signup",
  WrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Automatically log the user in right after a successful signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      console.log("saved successfully");
      return res.redirect("/listings");
    });

    console.log("Signup error:", err.message);
    return res.redirect("/signup");
  }),
);

// Render the login form and track redirection requests if present
router.get(
  "/login",
  WrapAsync(async (req, res) => {
    if (req.query.redirect) {
      console.log("Getting the query redirect URL: ", req.query.redirect);
      req.session.requestedUrl = req.query.redirect;
    }
    res.render("users/login.ejs");
  }),
);

// Authenticate user credentials and redirect them to their destination
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: "/login" }),
  WrapAsync((req, res) => {
    res.redirect(res.locals.savedUrl || "/listings");
  }),
);

// Terminate the active user session and redirect to the listings overview
router.get(
  "/signout",
  WrapAsync((req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/listings");
    });
  }),
);

module.exports = router;
