import { Review } from "../models/review.model.js";
import { Listing } from "../models/listing.model.js";
import wrapAsync from "../utils/wrapAsync.js";

const addReview = wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  console.log(req.params);
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
});

const deleteReview = wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  let deletedReview = await Review.findByIdAndDelete(reviewId);
  if (deletedReview) {
    req.flash("successMsg", "Review deleted!");
  } else {
    req.flash("errorMsg", "Review is not deleted, try again!");
  }

  return res.redirect(`/listings/${id}`);
});

export { addReview, deleteReview };
