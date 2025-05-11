import express from "express";
import path from "path"; 
import { fileURLToPath } from "url";
import { dirname } from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import listingsRouter from "./routes/listing.route.js";
import reviewsRouter from "./routes/reviews.route.js";
import ExpressError from "./utils/ExpressError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//All config & middleware
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

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

app.all(/.*/, (req, res, next) => {
  return next(new ExpressError(404, "Page not found"));
});

//Error middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  return res.status(statusCode).render("error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});

export { app };
