const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Course = mongoose.model("Course");

router.get("/", async (req, res, next) => {
  try {
    let courses = await Course.find();
    res.json(courses);
  } catch (e) {
    res.status(500).json({});
  }
});

router.get("/name/:name", async (req, res, next) => {
  let regex = ".*" + req.params.name.split(" ").join(".*") + ".*";
  try {
    let courses = await Course.find({ name: { $regex: regex, $options: "i" } });
    return res.json(courses);
  } catch (e) {
    console.log(e);
    return res.status(400).json({});
  }
});

module.exports = router;
