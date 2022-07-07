const express = require("express");
const app = express();
const router = express.Router();
const userdashRoute = require("./userdashboard");
const admindashRoute = require("./admindashboard");
const eventsRoute = require("./events");
const redirect = require("../controllers/redirect");
var path = require("path");

router.use("/events", eventsRoute);

router.get("/logout", redirect.RedirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/userdashboard");
    }
  });
  res.redirect("/login");
});
router.get("/admin/logout", redirect.RedirectadminLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/admindashboard");
    }
  });
  res.redirect("/admin/login");
});

router.get("/a10", (req, res) => {
  res.redirect("/home");
});

router.use(
  "/eventsubmit",
  redirect.RedirectLogin,
  redirect.RedirectVerify,
  eventsRoute
);
router.use("/userdashboard", userdashRoute);
router.use("/admindashboard", admindashRoute);

module.exports = router;
