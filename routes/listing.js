const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });
  })
);

// New route (because if we write below the show route then express assume new as :id)
router.get("/new", (req, res) => {
  return res.render("listings/new.ejs");
});

//Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("errorMsg", "Listing you request for does not exist!");
      return res.redirect("/listings");
    }
    return res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let {title, descripttion, image, price, country, location} = req.body;
    let newListing = new Listing(req.body.listing);
    if (await newListing.save()) {
      req.flash("successMsg", "New Listing Created!");
    } else {
      req.flash("errorMsg", "Error while creating!");
    }
    return res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("errorMsg", "Listing you request for does not exist!");
      return res.redirect("/listings");
    }
    return res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    if (updatedListing) {
      req.flash("successMsg", "Listing updated!");
    } else {
      req.flash("errorMsg", "Error while updating");
    }
    return res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing) {
      req.flash("successMsg", "Listing Deleted!");
    } else {
      req.flash("errorMsg", "Error while deleting!");
    }
    // console.log(deletedLising);
    return res.redirect("/listings");
  })
);

module.exports = router;
