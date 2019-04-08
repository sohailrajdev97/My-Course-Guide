const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Prof = mongoose.model("Professor");

router.get("/", async (req, res, next) => {
  try {
    let courses;
    if (req.query.prof) {
      let prof = await Prof.find({ email: req.query.prof });
      if (!prof) return res.status(404).json([]);
      courses = await Course.find({
        ...req.campusFilter,
        "history.professor": prof
      }).select({
        id: 1,
        name: 1,
        history: 1,
        campus: 0,
        numQuestions: 1,
        numReviews: 1
      });
    } else {
      courses = await Course.find(req.campusFilter);
    }
    res.json(courses);
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
