const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const WrapAsync = require("../utils/WrapAsync");

const Listing = require("../models/listing");
const Review = require("../models/review");

// Create a new review for a specific listing
router.post(
  "/",
  isLoggedIn,
  WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review({
      rating: req.body.rating,
      comment: req.body.comment,
    });

    newReview.author = req.user;
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review created successfully");
    res.redirect(`/listings/${req.params.id}`);
  }),
);

// Delete a specific review and remove its reference from the listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
