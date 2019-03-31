const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Professor = mongoose.model("Professor");

router.get("/", async (req, res, next) => {
  try {
    let professors = await Professor.find({ campus: req.user.campus }).sort(
      "name"
    );
    res.json(professors);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Could not find professor list" });
  }
});

module.exports = router;
