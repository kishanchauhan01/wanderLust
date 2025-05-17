import { Listing } from "../models/listing.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const allListings = wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index.ejs", { allListings });
});

const newListing = wrapAsync(async (req, res) => {
  return res.render("listings/new.ejs");
});

const showListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you request for does not exist!");
    return res.redirect("/listings");
  }
  return res.render("listings/show.ejs", { listing });
});

const createListing = wrapAsync(async (req, res) => {
  // // let {title, descripttion, image, price, country, location} = req.body;
  const newListing = new Listing(req.body.listing);

  //upload file to cloudinary
  const cloudinaryUploadResult = await uploadOnCloudinary(req.file.path);
  if (!cloudinaryUploadResult || !cloudinaryUploadResult.url) {
    req.flash("error", "Failed to upload new image.");
    return res.redirect("/listings");
  }

  newListing.owner = req.user._id;
  newListing.image = {
    url: cloudinaryUploadResult.url,
    public_id: cloudinaryUploadResult.public_id,
    filename: cloudinaryUploadResult.filename,
  };

  if (await newListing.save()) {
    req.flash("successMsg", "New Listing Created!");
  } else {
    req.flash("error", "Error while creating!");
  }
  return res.redirect("/listings");
});

const editListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you request for does not exist!");
    return res.redirect("/listings");
  }
  return res.render("listings/edit.ejs", { listing });
});

const updateListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }

  let cloudinaryUploadResult = null;

  // If new image is uploaded
  if (req.file && req.file.path) {
    // Delete old image from Cloudinary
    const cloudinaryDeleteResult = await deleteFromCloudinary(
      listing.image.public_id
    );
    if (!cloudinaryDeleteResult) {
      req.flash("error", "Failed to delete old image from Cloudinary.");
      return res.redirect(`/listings/${id}`);
    }

    // Upload new image
    cloudinaryUploadResult = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryUploadResult || !cloudinaryUploadResult.url) {
      req.flash("error", "Failed to upload new image.");
      return res.redirect(`/listings/${id}`);
    }
  }

  //creating new updatePayload
  let updatePayload = {
    ...req.body.listing,
  };

  if (cloudinaryUploadResult) {
    updatePayload.image = {
      url: cloudinaryUploadResult.url,
      public_id: cloudinaryUploadResult.public_id,
      filename: cloudinaryUploadResult.filename,
    };
  }

  let updatedListing = await Listing.findByIdAndUpdate(id, updatePayload);

  if (updatedListing) {
    req.flash("successMsg", "Listing updated!");
  } else {
    req.flash("error", "Error while updating");
  }
  return res.redirect(`/listings/${id}`);
});

const deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  if (deletedListing) {
    req.flash("successMsg", "Listing Deleted!");
  } else {
    req.flash("error", "Error while deleting!");
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
