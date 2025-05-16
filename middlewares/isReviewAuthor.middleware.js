import { Review } from "../models/review.model.js";
import wrapAsync from "../utils/wrapAsync.js";

export const isReviewAuthor = wrapAsync(async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (res.locals.currUser && !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
});
