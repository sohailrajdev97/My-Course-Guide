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

  if (req.body.rating && req.body.type === "Question")
    return res.json(400, { msg: "Rating is only allowed for the type Review" });

  if (req.body.type === "Review") {
    let params = ["overall", "difficulty", "attendance", "textbook", "grading"];
    let msg = null;

    params.forEach(param => {
      if (!req.body.rating[param]) {
        msg = `Supply rating[${param}] in request body`;
        return;
      }

      if (
        parseFloat(req.body.rating[param]) < 0 ||
        parseFloat(req.body.rating[param]) > 5
      ) {
        msg = `Invalid value for rating[${param}]`;
        return;
      }
      req.body.rating[param] = parseInt(req.body.rating[param]);
    });

    if (msg) return res.json(400, { msg });
  }

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

    let numQuestions = await Record.count({ type: "Question", course });
    let numReviews = await Record.count({ type: "Review", course });
    let averages = await Record.aggregate([
      {
        $group: {
          _id: "$course",
          overall: { $avg: "$rating.overall" },
          difficulty: { $avg: "$rating.difficulty" },
          grading: { $avg: "$rating.grading" },
          textbook: { $avg: "$rating.textbook" },
          attendance: { $avg: "$rating.attendance" }
        }
      },
      {
        $match: {
          _id: course._id
        }
      }
    ]);

    await Course.updateOne(course, {
      $set: {
        numQuestions,
        numReviews,
        averages: averages[0]
      }
    });

    await Vote.create({ for: record._id, forModel: "Record" });
    return res.json({ msg: "Record Created" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

module.exports = router;
