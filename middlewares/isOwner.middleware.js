import { Listing } from "../models/listing.model.js";
import wrapAsync from "../utils/wrapAsync.js";

export const isOwner = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to access this feature");
    return res.redirect(`/listings/${id}`);
  }
  next();
});
