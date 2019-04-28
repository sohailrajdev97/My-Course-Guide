const express = require("express");
const router = express.Router();

const checkToken = require("./authMiddleware");
const mongoose = require("mongoose");
const Report = mongoose.model("Report");

router.post("/", checkToken("student"), async (req, res, next) => {
  if (!req.body.for && !req.body.forModel)
    return res.status(400).json({
      msg: "Supply a record / reply id in request body"
    });

  let parentType = req.body.forModel === "Answer" ? "Reply" : "Record";
  let parentModel = mongoose.model(parentType);
  let parentId = req.body.for;

  try {
    let parent = await parentModel.findOne({ _id: parentId });

    if (!parent) return res.status(404).json({ msg: "Parent not found" });

    let user = req.user.id;
    // console.log(user);
    let prevReport = await Report.findOne({
      for: parentId,
      by: user
    });
    if (prevReport)
      return res.status(403).json({ msg: "Report already exists" });

    await Report.create({
      forModel: parentType,
      for: parentId,
      by: user
    });
    return res.json({ msg: `${parentType} Reported` });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

router.get(
  "/",
  checkToken(["student", "prof", "hod", "admin"]),
  async (req, res, next) => {
    try {
      if (req.user.role === "student") {
        let reports = await Report.find({
          by: req.user.id
        });
        return res.status(200).json(reports);
      } else if (req.user.role === "admin") {
        let reports = await Report.find({});
        return res.status(200).json(reports);
      } else {
        return res.status(200).json();
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Request failed" });
    }
  }
);

router.get(
  "/:type",
  checkToken(["student", "prof", "hod", "admin"]),
  async (req, res, next) => {
    try {
      if (req.user.role === "student") {
        let reports = await Report.find({
          forModel: req.params.type,
          by: req.user.id
        });
        // console.log(reports);

        return res.status(200).json(reports);
      } else if (req.user.role === "admin") {
        let reports = await Report.find({ forModel: req.params.type });
        // console.log(reports);

        return res.status(200).json(reports);
      } else {
        return res.status(200).json();
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Request failed" });
    }
  }
);

module.exports = router;
