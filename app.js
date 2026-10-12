const express = require("express");
const app = express();
const ejsMate = require("ejs-mate"); // for boilerplate
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const WrapAsync = require("./utils/WrapAsync");

// EJS _
// for boilerplates
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const methodOverride = require("method-override"); // 1. Import it
// Place this below your body-parsers/static file configurations
app.use(express.urlencoded({ extended: true })); // Essential to parse incoming form data
app.use(methodOverride("_method")); // 2. Enable it with custom query key "_method"

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");

// 1. Session Configuraton Options

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cookie lasts 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions)); // Initialize session tracking middleware
app.use(flash()); // using flash

//2. Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//3. Tell Passport to use the Local Strategy on User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // How to store user info in session
passport.deserializeUser(User.deserializeUser()); // How to remove user info from session

// Middleware for saveCurrUser

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Getting the routers
const listingRouter = require("./routes/listing");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");

const URL = "mongodb://127.0.0.1:27017/wanderlustclone";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URL);
}

// Using the routes
app.use("/listings", listingRouter);
app.use("/", userRouter);
app.use("/listings/:id/review", reviewRouter);

app.get("/", (req, res) => {
  res.send("Hello, I am root");
  console.log("after the session: ", res.locals.redirectUrl);
});

app.all("*path", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("server is listening to prot 8080");
});
