const express = require("express");
const router = express.Router();

const checkToken = require("./authMiddleware");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Review = mongoose.model("Review");
const Student = mongoose.model("Student");

router.post("/", checkToken(["student"]), async (req, res, next) => {
  if(!req.body.course)
    return res.status(400).json({ msg: "Supply a course id in request body" });
    
  if(!req.body.content)
    return res.status(400).json({ msg: "Supply a review content in request body" });

  let courseId = req.body.course;
  let user = await Student.findOne({ _id: req.user.id });
  let userCourses = user.courses.map(course => course.id.toString());
  
  if(userCourses.indexOf(req.body.course) === -1)
    return res.status(403).json({ msg: "You are not eligible to write a review for this course" });
  
  try {

    let course = await Course.findOne({ _id: mongoose.Types.ObjectId(courseId) });

    if(!course)
      return res.status(404).json({ msg: "Course not found" });

    await Review.create({
      course: courseId,
      content: req.body.content,
      student: req.user.id,
      isAnonymous: req.body.isAnonymous ? true : false
    });

    return res.json({ msg: "Review Created" });

  } catch(e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

module.exports = router;
