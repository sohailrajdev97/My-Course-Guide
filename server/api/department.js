const express = require("express");
const router = express.Router();
const _ = require("lodash");

const mongoose = require("mongoose");
const Department = mongoose.model("Department");
const Professor = mongoose.model("Professor");

router.get("/:campus", (req, res, next) => {
  Department.find(
    {
      campus: req.params.campus
    },
    (err, departments) => {
      if (err) {
        return res.status(500).json({});
      }
      return res.json(departments);
    }
  );
});

module.exports = router;
