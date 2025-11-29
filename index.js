import "./loadEnv.js";
import { app } from "./app.js";
import connectDB from "./db/connectDB.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is listing on port: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });

// app.listen(process.env.PORT, () => {
//   console.log(`app is listing on port: ${process.env.PORT}`);
// });
