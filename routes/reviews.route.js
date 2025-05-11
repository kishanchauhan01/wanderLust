import { Router } from "express";
import { addReview, deleteReview } from "../controllers/reviews.controller.js";
import { validateReview } from "../middlewares/validateReview.middleware.js";

const router = Router({ mergeParams: true });

//Reviews
//Post route for adding reviews
router.route("/").post(validateReview, addReview);

//Delete review route
router.route("/:reviewId").delete(deleteReview);

export default router;
