const express = require("express");
const router = express.Router();

const auth = require("./auth");
const csv = require("./csv");
const course = require("./course");
const checkToken = require("./authMiddleware");
const records = require("./records");
const replies = require("./replies");
const professors = require("./professors");

router.all("/", (req, res, next) => {
  console.log(`${req.method} for ${req.url}`);
  next();
});

router.use("/auth", auth);
router.use(
  "/courses",
  checkToken(["admin", "student", "professor", "hod"]),
  course
);
router.use("/csv", checkToken("admin"), csv);
router.use("/records", records);
router.use("/replies", replies);
router.use(
  "/professors",
  checkToken(["admin", "student", "professor", "hod"]),
  professors
);

module.exports = router;
