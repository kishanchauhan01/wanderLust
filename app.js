const express = require("express");
const app = express();
const connectDB = require("./connectDB.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");

//All config & middleware
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

const sessionOption = {
  secret: "f3!@9g$2Kls8*vnQx1#Wz7Jp^kishan@4Nm",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//All routes
app.get("/", (req, res) => {
  return res.send("hi hello");
});

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("successMsg");
  res.locals.error = req.flash("errorMsg");
  return next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all(/.*/, (req, res, next) => {
  return next(new ExpressError(404, "Page not found"));
});

//Error middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  return res.status(statusCode).render("error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  return console.log(`server is listing to http://localhost:${8080}`);
});
