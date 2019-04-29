const express = require("express");
const router = express.Router();

const auth = require("./auth");
const upload = require("./upload");
const course = require("./course");
const checkToken = require("./authMiddleware");
const handouts = require("./handouts");
const professors = require("./professors");
const records = require("./records");
const replies = require("./replies");
const votes = require("./votes");
const reports = require("./reports");

router.all("/", (req, res, next) => {
  console.log(`${req.method} for ${req.url}`);
  next();
});

router.use("/auth", auth);
router.use("/courses", checkToken(["admin", "student", "prof", "hod"]), course);
router.use("/upload", checkToken("admin"), upload);
router.use("/records", records);
router.use("/handouts", handouts);
router.use("/replies", replies);
router.use("/votes", votes);
router.use(
  "/professors",
  checkToken(["admin", "student", "prof", "hod"]),
  professors
);
router.use("/reports", reports);

module.exports = router;
