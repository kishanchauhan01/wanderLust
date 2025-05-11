import { reviewSchema } from "../schema.js";

export const validateReview = (req, _, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
