import { Router } from "express";
import {
  allListings,
  createListing,
  deleteListing,
  editListing,
  newListing,
  showListing,
  updateListing,
} from "../controllers/listings.controller.js";
import { validateListing } from "../middlewares/validateListing.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

const router = Router();

//Index route
router.route("/").get(allListings);

// New route (because if we write below the show route then express assume new as :id)
router.route("/new").get(isLoggedIn, newListing);

//Show route
router.route("/:id").get(showListing);

//Create Route
router.route("/").post(isLoggedIn, validateListing, createListing);

//Edit Route
router.route("/:id/edit").get(isLoggedIn, editListing);

//Update Route
router.route("/:id").put(isLoggedIn, validateListing, updateListing);

//Delete Route
router.route("/:id").delete(isLoggedIn, deleteListing);

export default router;
