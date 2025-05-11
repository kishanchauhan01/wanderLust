import { listingSchema } from "../schema.js";

export const validateListing = (req, _, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
