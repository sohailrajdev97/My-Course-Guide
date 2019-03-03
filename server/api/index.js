const express = require("express");
const router = express.Router();

const auth = require("./auth");
const csv = require("./csv");
const course = require("./course");

router.all("/", (req, res, next) => {
  console.log(`${req.method} for ${req.url}`);
  next();
});

router.use("/auth", auth);
router.use("/course", course);
router.use("/csv", csv);

module.exports = router;
