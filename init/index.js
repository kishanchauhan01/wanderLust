import initData from "./data.js";
import { Listing } from "../models/listing.model.js";
import connectDB from "../db/connectDB.js";

connectDB()
  .then(() => {
    console.log("db connected!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  let newData = initData.map((obj) => ({
    ...obj,
    owner: "682440019b549aeb3c6cec4b",
  }));
  await Listing.insertMany(newData);
  console.log("data was initialized");
};

initDB();
