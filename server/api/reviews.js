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

router.post("/vote/:type", checkToken("student"), async (req, res, next) => {
 
  if(req.params.type !== "up" && req.params.type !== "down")
    return res.status(404).send();

  if(!req.body.review)
    return res.status(400).json({ msg: "Supply a review id in request body" });
  
  try {

    let review = await Review.findOne({ _id: req.body.review });

    if(!review)
      return res.status(404).json({ msg: "Review not found" });
    
    if(review.upvotes.indexOf(req.user.id) >= 0 && req.params.type === "up") 
      return res.status(400).json({ msg: "You have already upvoted this review" });
      
    if(review.downvotes.indexOf(req.user.id) >= 0 && req.params.type === "down")
      return res.status(400).json({ msg: "You have already downvoted this review" });
    
    if(req.params.type === "up") {
      await Review.updateOne({ _id: req.body.review }, { $push: { upvotes: req.user.id }, $pull: { downvotes: req.user.id } });
    } else {
      await Review.updateOne({ _id: req.body.review }, { $push: { downvotes: req.user.id }, $pull: { upvotes: req.user.id } });
    }

    return res.json({ msg: "Vote added" });

  } catch(e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
  
 });

module.exports = router;
