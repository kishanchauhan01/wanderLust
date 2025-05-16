import wrapAsync from "../utils/wrapAsync.js";
import { User } from "../models/user.model.js";
import { saveRedirectUrl } from "../middlewares/isLoggedIn.middleware.js";

const signupForm = (_, res) => {
  return res.render("user/signup.ejs");
};

const signupUser = wrapAsync(async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("successMsg", "Welcom to WanderLust!");
      return res.redirect("/listings");
    });
  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
});

const loginForm = (_, res) => {
  return res.render("user/login.ejs");
};

const loginUser = wrapAsync(async (req, res) => {
  req.flash("successMsg", "Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
});

const logOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("successMsg", "You are logged out!");
    res.redirect("/listings");
  });
};

export { signupForm, signupUser, loginForm, loginUser, logOut };
