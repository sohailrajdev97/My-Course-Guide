const express = require("express");
const router = express.Router();

const _ = require("lodash");
const multer = require("multer");
const upload = multer({
  dest: process.env.UPLOAD_DIR
});
const csv = require("fast-csv");

const mongoose = require("mongoose");
const Professor = mongoose.model("Professor");
const Course = mongoose.model("Course");
const Student = mongoose.model("Student");

const profHeaders = ["name", "email", "campus", "department", "hod"];
const courseHeaders = ["id", "name", "year", "semester", "professor"];
const studentHeaders = [
  "id",
  "name",
  "email",
  "campus",
  "course",
  "year",
  "semester"
];

let validator = async data => {
  if (_.isEqual(Object.keys(data), profHeaders)) {
    data.hod = data.hod == "YES" ? true : false;
    try {
      let doc = await Professor.findOneAndUpdate(
        {
          email: data.email
        },
        data,
        {
          upsert: true
        }
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  if (_.isEqual(Object.keys(data), courseHeaders)) {
    try {
      let course = await Course.findOne({
        id: data.id
      });
      let prof = await Professor.findOne({
        email: data.professor
      });
      if (prof == null) {
        return false;
      }
      if (course) {
        course.name = data.name;
        let historyUpdated = false;
        course.history.forEach(item => {
          if (
            item.year == parseInt(data.year) &&
            item.semester == parseInt(data.semester)
          ) {
            item.professor = prof._id;
            historyUpdated = true;
          }
        });
        if (!historyUpdated) {
          course.history.push({
            year: data.year,
            semester: data.semester,
            professor: prof._id
          });
        }
        await course.save();
      } else {
        await Course.create({
          id: data.id,
          name: data.name,
          history: [
            {
              year: data.year,
              semester: data.semester,
              professor: prof._id
            }
          ]
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  if (_.isEqual(Object.keys(data), studentHeaders)) {
    try {
      let course = await Course.findOne({
        id: data.course
      });
      if (!course) return false;

      let offeredInGivenSemester = false;

      course.history.forEach(item => {
        if (
          item.year == parseInt(data.year) &&
          item.semester == parseInt(data.semester)
        ) {
          offeredInGivenSemester = true;
        }
      });

      if (!offeredInGivenSemester) return false;

      let student = await Student.findOneAndUpdate(
        {
          id: data.id
        },
        {
          $set: {
            name: data.name,
            email: data.email,
            id: data.id,
            campus: data.campus
          },
          $addToSet: {
            courses: {
              id: course._id,
              year: data.year,
              semester: data.semester
            }
          }
        },
        {
          upsert: true
        }
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
};

router.post("/", upload.single("csv"), (req, res, next) => {
  if (req.file.mimetype != "text/csv") {
    return res.status(400).json({
      msg: "Only CSV files are allowed"
    });
  }
  let invalidRows = [];
  csv
    .fromPath(req.file.path, {
      headers: true
    })
    .validate((data, next) => {
      validator(data).then(isValid => {
        next(null, isValid);
      });
    })
    .on("data-invalid", data => {
      invalidRows.push(data);
    })
    .on("data", data => {})
    .on("end", () => {
      if (invalidRows.length == 0) {
        res.status(200).json({});
      } else {
        res.status(400).json({
          invalidRows
        });
      }
    });
});

module.exports = router;
