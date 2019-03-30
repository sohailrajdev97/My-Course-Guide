const express = require("express");
const router = express.Router();

const auth = require("./auth");
const csv = require("./csv");
const course = require("./course");
const checkToken = require("./authMiddleware");
const reviews = require("./reviews");
const professors = require("./professors");

router.all("/", (req, res, next) => {
  console.log(`${req.method} for ${req.url}`);
  next();
});

router.use("/auth", auth);
router.use("/courses", course);
router.use("/csv", checkToken("admin"), csv);
router.use("/reviews", reviews);
router.use("/professors", checkToken(["admin", "student", "professor", "hod"]), professors);

module.exports = router;
