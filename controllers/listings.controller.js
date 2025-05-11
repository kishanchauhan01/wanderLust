import { Listing } from "../models/listing.model.js";
import wrapAsync from "../utils/wrapAsync.js";

const allListings = wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index.ejs", { allListings });
});

const newListing = wrapAsync(async (req, res) => {
  return res.render("listings/new.ejs");
});

const showListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("errorMsg", "Listing you request for does not exist!");
    return res.redirect("/listings");
  }
  return res.render("listings/show.ejs", { listing });
});

const createListing = wrapAsync(async (req, res) => {
  // let {title, descripttion, image, price, country, location} = req.body;
  let newListing = new Listing(req.body.listing);
  if (await newListing.save()) {
    req.flash("successMsg", "New Listing Created!");
  } else {
    req.flash("errorMsg", "Error while creating!");
  }
  return res.redirect("/listings");
});

const editListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("errorMsg", "Listing you request for does not exist!");
    return res.redirect("/listings");
  }
  return res.render("listings/edit.ejs", { listing });
});

const updateListing = wrapAsync(async (req, res) => {
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
});

const deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  if (deletedListing) {
    req.flash("successMsg", "Listing Deleted!");
  } else {
    req.flash("errorMsg", "Error while deleting!");
  }
  // console.log(deletedLising);
  return res.redirect("/listings");
});

export {
  allListings,
  newListing,
  showListing,
  createListing,
  editListing,
  updateListing,
  deleteListing,
};
