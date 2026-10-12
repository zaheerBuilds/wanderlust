const Listing = require("./models/listing");
const Review = require("./models/review");
const { WrapAsync } = require("./utils/WrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // so we store the url to session . not to locals - becuase the locals are only for one
    // request . so when we go to /login it will be undefined . so here we store it into the
    // the session . it will be in session until new session is made by the passport.
    // we make a way to store the the session into local for that to be made session
    req.session.requestedUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

// getting redirect url before the session is destroyed

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.requestedUrl) {
    res.locals.savedUrl = req.session.requestedUrl;
    console.log("Redirecting to saved URL:", res.locals.savedUrl);
  } else if (req.session.redirectUrl) {
    res.locals.savedUrl = req.session.redirectUrl;
  } else {
    res.locals.savedUrl = "/listings";
  }
  next();
};
module.exports.isAuthor = async (req, res, next) => {
  const id = req.params.id;

  const listing = await Listing.findById(id);
  if (!listing.author.equals(res.locals.currUser._id)) {
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to perform this operation");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = async (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.vaidateReview = async (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
