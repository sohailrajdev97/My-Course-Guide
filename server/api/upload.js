const express = require("express");
const router = express.Router();

const _ = require("lodash");
const multer = require("multer");
const upload = multer({
  dest: process.env.UPLOAD_DIR
});
const csv = require("fast-csv");
const extract = require("extract-zip");
const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");
const Professor = mongoose.model("Professor");
const Course = mongoose.model("Course");
const Student = mongoose.model("Student");

const profHeaders = ["name", "email", "campus", "department", "hod"];
const courseHeaders = ["id", "name", "year", "semester", "professor", "campus"];
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
  if (!data) return false;
  if (_.isEqual(Object.keys(data), profHeaders)) {
    data.hod = data.hod === "YES" ? true : false;
    try {
      await Professor.findOneAndUpdate(
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
        id: data.id,
        campus: data.campus
      });
      let prof = await Professor.findOne({
        email: data.professor
      });
      if (prof === null) {
        return false;
      }
      if (course) {
        course.name = data.name;
        let historyUpdated = false;
        course.history.forEach(item => {
          if (
            item.year === parseInt(data.year) &&
            item.semester === parseInt(data.semester)
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
          course.history.sort((left, right) => {
            return (
              right.year * 10 +
              right.semester -
              (left.year * 10 + left.semester)
            );
          });
        }
        await course.save();
      } else {
        await Course.create({
          id: data.id,
          name: data.name,
          campus: data.campus,
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
        id: data.course,
        campus: data.campus
      });
      if (!course) return false;

      let offeredInGivenSemester = false;

      course.history.forEach(item => {
        if (
          item.year === parseInt(data.year) &&
          item.semester === parseInt(data.semester)
        ) {
          offeredInGivenSemester = true;
        }
      });

      if (!offeredInGivenSemester) return false;

      await Student.findOneAndUpdate(
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

router.post("/", upload.single("file"), (req, res, next) => {
  if (req.file.mimetype === "text/csv") {
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
        if (invalidRows.length === 0) {
          res.status(200).json({});
        } else {
          res.status(400).json({
            invalidRows
          });
        }
      });
  } else if (req.file.mimetype === "application/zip") {
    let invalidRows = [];
    let onEntry = async (entry, zipfile) => {
      let name = entry.fileName;
      let splittedName = name.split("_");
      if (splittedName.length === 4 && name.split("/").length === 1) {
        // COURSE_YEAR_SEMESTER_CAMPUS
        let course = await Course.findOne({
          id: splittedName[0],
          campus: splittedName[3].split(".")[0],
          history: {
            $elemMatch: {
              year: splittedName[1],
              semester: splittedName[2]
            }
          }
        }).lean();
        if (!course) return invalidRows.push({ "File Name": name });
        course.history.forEach(historyItem => {
          if (
            historyItem.year === parseInt(splittedName[1]) &&
            historyItem.semester === parseInt(splittedName[2])
          ) {
            historyItem.handout = name;
          }
        });
        await Course.updateOne({ _id: course._id }, course);
      } else {
        invalidRows.push({ "File Name": name });
      }
    };
    extract(
      req.file.path,
      {
        dir: path.join(process.cwd(), "server", "handouts"),
        onEntry
      },
      err => {
        if (err) {
          console.log(err);
          return res.json(500, { msg: "Server Error" });
        }
        if (invalidRows.length === 0) {
          res.status(200).json({});
        } else {
          res.status(400).json({
            invalidRows
          });
          invalidRows.forEach(file => {
            fs.unlinkSync(
              path.join(process.cwd(), "server", "handouts", file["File Name"])
            );
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      msg: "Only CSV / Zip files are allowed"
    });
  }
});

module.exports = router;
