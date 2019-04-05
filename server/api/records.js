const express = require("express");
const router = express.Router();

const as = require("async");
const checkToken = require("./authMiddleware");

const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Record = mongoose.model("Record");
const Reply = mongoose.model("Reply");
const Student = mongoose.model("Student");
const Vote = mongoose.model("Vote");

router.get(
  "/:course",
  checkToken(["admin", "student", "professor", "hod"]),
  async (req, res, next) => {
    try {
      let course = await Course.findOne({
        id: req.params.course,
        ...req.campusFilter
      });
      if (!course) return res.status(404).json({ msg: "Course not found" });

      let reviews = await Record.find({
        course: course._id,
        type: "Review"
      });
      let questions = await Record.find({
        course: course._id,
        type: "Question"
      }).lean();
      as.each(
        questions,
        async question => {
          question.answers = await Reply.find({ record: question._id })
            .select({
              _id: 0,
              time: 1,
              content: 1,
              replierType: 1
            })
            .lean();
        },
        () => {
          return res.json({ questions, reviews });
        }
      );
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Request failed" });
    }
  }
);

router.post("/", checkToken(["student"]), async (req, res, next) => {
  if (!req.body.course)
    return res.status(400).json({ msg: "Supply a course id in request body" });

  if (["Review", "Question"].indexOf(req.body.type) === -1)
    return res.status(400).json({ msg: "Invalid record type" });

  if (!req.body.content)
    return res
      .status(400)
      .json({ msg: "Supply a record content in request body" });

  let courseId = req.body.course;
  let user = await Student.findOne({ _id: req.user.id });
  let userCourses = user.courses.map(course => course.id.toString());

  if (userCourses.indexOf(req.body.course) === -1 && req.body.type === "Review")
    return res
      .status(403)
      .json({ msg: "You are not eligible to write a review for this course" });

  try {
    let course = await Course.findOne({
      _id: mongoose.Types.ObjectId(courseId)
    });

    if (!course) return res.status(404).json({ msg: "Course not found" });

    let record = await Record.create({
      course: courseId,
      type: req.body.type,
      content: req.body.content,
      student: req.user.id,
      rating: req.body.rating,
      isAnonymous: req.body.isAnonymous ? true : false
    });

    await Vote.create({ record: record._id });
    return res.json({ msg: "Record Created" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

router.post("/vote/:type", checkToken("student"), async (req, res, next) => {
  if (req.params.type !== "up" && req.params.type !== "down")
    return res.status(404).send();

  if (!req.body.record)
    return res.status(400).json({ msg: "Supply a record id in request body" });

  try {
    let record = await Record.findOne({ _id: req.body.record });

    if (!record) return res.status(404).json({ msg: "Record not found" });

    let vote = await Vote.findOne({ record: req.body.record });

    if (vote.upvotes.indexOf(req.user.id) >= 0 && req.params.type === "up")
      return res
        .status(400)
        .json({ msg: "You have already upvoted this record" });

    if (vote.downvotes.indexOf(req.user.id) >= 0 && req.params.type === "down")
      return res
        .status(400)
        .json({ msg: "You have already downvoted this record" });

    if (req.params.type === "up") {
      vote = await Vote.findOneAndUpdate(
        { record: req.body.record },
        { $push: { upvotes: req.user.id }, $pull: { downvotes: req.user.id } },
        { new: true }
      );
    } else {
      vote = await Vote.findOneAndUpdate(
        { record: req.body.record },
        { $push: { downvotes: req.user.id }, $pull: { upvotes: req.user.id } },
        { new: true }
      );
    }

    // TODO: Update the count after acquiring a lock / use mongoose versioning middleware
    await Record.updateOne(
      { _id: req.body.record },
      { $set: { voteCount: vote.upvotes.length - vote.downvotes.length } }
    );

    return res.json({ msg: "Vote added" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

module.exports = router;
