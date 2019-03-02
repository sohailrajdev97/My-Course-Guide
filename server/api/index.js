const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const auth = require("./auth");
const department = require("./department");
const csv = require("./csv");

router.all("/", (req, res, next) => {
  console.log(`${req.method} for ${req.url}`);
  next();
});

router.use("/auth", auth);
router.use("/departments", department);
router.use("/csv", csv);

module.exports = router;
