import "./loadEnv.js";
import { app } from "./app.js";
import connectDB from "./db/connectDB.js";


connectDB()
  .then(() => {
    app.listen(8080, () => {
      console.log("app is listing on http://localhost:8080");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });
