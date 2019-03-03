const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Course = mongoose.model("Course");

let filterByCampus = (courses, campus) =>
  courses.filter(course => {
    course.history = course.history.filter(
      history => history.professor.campus == campus
    );
    return course.history.length > 0;
  });

router.get("/", async (req, res, next) => {
  try {
    let courses = await Course.find();
    res.json(courses);
  } catch (e) {
    res.status(500).json({});
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let course = await Course.findOne({ id: req.params.id }, { lean: true })
      .select("id name")
      .populate("history.professor");

    if (!course) return res.status(404).json({});

    let filteredCourse = filterByCampus([course], req.user.campus);

    return res
      .status(filteredCourse.length ? 200 : 404)
      .json(filteredCourse[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.get("/name/:name", async (req, res, next) => {
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
      .select("id name")
      .populate("history.professor");
    return res.json(filterByCampus(courses, req.user.campus));
  } catch (e) {
    console.log(e);
    return res.status(400).json({});
  }
});

module.exports = router;
