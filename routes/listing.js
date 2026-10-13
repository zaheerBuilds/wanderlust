const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const { listingSchema } = require("../schema.js");

const Listing = require("../models/listing");
const { isLoggedIn, isAuthor, validateListing } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Show all listings on index route
router.get(
  "/",
  WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { listings: allListings });
  }),
);

// Render the form to create a new listing
router.get(
  "/new",
  isLoggedIn,
  WrapAsync((req, res) => {
    res.render("listings/create.ejs");
  }),
);

// Save the new listing into the database
router.post(
  "/",
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  WrapAsync(async (req, res) => {
    let { listing } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(listing);
    newListing.image = { filename, url };
    newListing.author = req.user._id;
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Show details for an individual listing with authors and reviews populated
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("author")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      });
    res.render("listings/show.ejs", { listing });
  }),
);

// Delete an individual listing from the database
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

// Render the edit form for an individual listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update the listing details in the database
router.patch(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.single("listing[image]"),
  validateListing,
  WrapAsync(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const { id } = req.params;
    const { listing } = req.body;
    listing.image = { filename, url };
    await Listing.findByIdAndUpdate(id, listing, {
      new: true,
    });
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
