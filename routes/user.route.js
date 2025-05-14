import { Router } from "express";
import {
  signupForm,
  signupUser,
  loginForm,
  loginUser,
  logOut,
} from "../controllers/user.controller.js";
import passport from "passport";

const router = Router({ mergeParams: true });

//signup
router.route("/signup").get(signupForm);
router.route("/signup").post(signupUser);

//login
router.route("/login").get(loginForm);
router.route("/login").post(
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  loginUser
);

//logout
router.route("/logout").get(logOut);

export default router;
