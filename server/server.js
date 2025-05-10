const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(flash());

app.use(
  session({
    secret: "f3!@9g$2Kls8*vnQx1#Wz7Jp^kishan@4Nm",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not registerd");
  } else {
    req.flash("success", "user registerd successfully!!!");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }

//   res.send(`You sent a request ${req.session.count} times`);
// });

app.listen(3000, () => {
  console.log(`server is running on http://localhost:3000`);
});
