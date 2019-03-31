const express = require("express");
const router = express.Router();

const checkToken = require("./authMiddleware");
const jdenticon = require("jdenticon")
const mongoose = require("mongoose");
const Course = mongoose.model("Course");

let filterByCampus = (courses, campus) =>
  courses.filter(course => {
    course.history = course.history.filter(
      history => history.professor.campus == campus
    );
    return course.history.length > 0;
  });

let sortHistory = history =>
  history.sort((a, b) => b.year * 10 + b.semester - (a.year * 10 + a.semester));

router.get("/", checkToken(["admin", "student", "professor", "hod"]), async (req, res, next) => {
  try {
    let courses = await Course.find({});
    return res.json(
      req.user.role == "admin"
        ? courses
        : filterByCampus(courses, req.user.campus)
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.get("/:id", checkToken(["admin", "student", "professor", "hod"]), async (req, res, next) => {
  try {
    let course = await Course.findOne({ id: req.params.id }, { lean: true });
    if (!course) return res.status(404).json({ msg: "Course not found" });
    course.history = sortHistory(course.history);
    let filteredCourse =
      req.user.role == "admin"
        ? [course]
        : filterByCampus([course], req.user.campus);

    return res
      .status(filteredCourse.length ? 200 : 404)
      .json(filteredCourse[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.get("/:id/icon", (req, res, next) => {
  let png = jdenticon.toPng(req.params.id, 100);
  res.writeHead(200, {
    "Content-Type": "image/png"
  });
  res.end(png);
});

router.get("/name/:name", checkToken(["admin", "student", "professor", "hod"]), async (req, res, next) => {
  let regex = ".*" + req.params.name.split(" ").join(".*") + ".*";
  try {
    let courses = await Course.find(
      {
        $or: [
          { id: { $regex: regex, $options: "i" } },
          { name: { $regex: regex, $options: "i" } }
        ]
      },
      { lean: true }
    )
    return res.json(
      req.user.role == "admin"
        ? courses
        : filterByCampus(courses, req.user.campus)
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({});
  }
});

module.exports = router;
