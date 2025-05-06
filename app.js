const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const connectDB = require("./connectDB.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

connectDB()
  .then(() => {
    console.log("db connected!!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hi hello");
});

//Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New route (because if we write below the show route then express assume new as :id)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // console.log(req);
    const result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }

    // let {title, descripttion, image, price, country, location} = req.body;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError(400, "Send a valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedLising = await Listing.findByIdAndDelete(id);
    console.log(deletedLising);
    res.redirect("/listings");
  })
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//Error middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log(`server is listing to http://localhost:${8080}`);
});
