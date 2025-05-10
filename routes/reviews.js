const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Reviews
//Post route for adding reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    // await newReview.save();
    // await listing.save();
    if (await newReview.save()) {
      if (await listing.save()) {
        req.flash("successMsg", "Review is added!");
      } else {
        req.flash("errorMsg", "Review is not added, try again");
      }
    }
    // console.log("new review saved");
    return res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    if (deletedReview) {
      req.flash("successMsg", "Review deleted!");
    } else {
      req.flash("errorMsg", "Review is not deleted, try again!");
    }

    return res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
