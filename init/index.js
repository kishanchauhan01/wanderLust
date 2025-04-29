const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const connectDB = require("../connectDB.js");

connectDB()
  .then(() => {
    console.log("db connected!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
