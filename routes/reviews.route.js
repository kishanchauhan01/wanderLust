import { Router } from "express";
import { addReview, deleteReview } from "../controllers/reviews.controller.js";
import { validateReview } from "../middlewares/validateReview.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { isReviewAuthor } from "../middlewares/isReviewAuthor.middleware.js";

const router = Router({ mergeParams: true });

//Reviews
//Post route for adding reviews
router.route("/").post(isLoggedIn, validateReview, addReview);

//Delete review route
router.route("/:reviewId").delete(isLoggedIn, isReviewAuthor, deleteReview);

export default router;
