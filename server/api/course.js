const express = require("express");
const router = express.Router();

const checkToken = require("./authMiddleware");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");

router.use((req, res, next) => {
  let filter = {};

  if (req.user.role !== "admin") {
    filter.campus = req.user.campus;
  }

  req.campusFilter = filter;
  next();
});

router.get("/", async (req, res, next) => {
  try {
    let courses = await Course.find(req.campusFilter);
    return res.json(courses);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.get("/name/:name", async (req, res, next) => {
  let regex = ".*" + req.params.name.split(" ").join(".*") + ".*";
  try {
    let courses = await Course.find({
      ...req.campusFilter,
      $or: [
        { id: { $regex: regex, $options: "i" } },
        { name: { $regex: regex, $options: "i" } }
      ]
    });
    return res.json(courses);
  } catch (e) {
    console.log(e);
    return res.status(500).json({});
  }
});

router.get("/:id/:campus", checkToken("admin"), async (req, res, next) => {
  try {
    let course = await Course.findOne({
      id: req.params.id,
      campus: req.params.campus
    });
    if (!course) return res.status(404).json({ msg: "Course not found" });
    return res.json(course);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let course = await Course.findOne({
      id: req.params.id,
      ...req.campusFilter
    });
    if (!course) return res.status(404).json({ msg: "Course not found" });
    return res.json(course);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

module.exports = router;
