const express = require("express");
const router = express.Router();

const checkToken = require("./authMiddleware");
const mongoose = require("mongoose");
const Record = mongoose.model("Record");
const Reply = mongoose.model("Reply");

router.post("/", checkToken("student"), async (req, res, next) => {
  if (!req.body.record)
    return res.status(400).json({ msg: "Send a record id in request body" });

  if (!req.body.content)
    return res
      .status(400)
      .json({ msg: "Send a reply content in request body" });

  let record = await Record.findOne({ _id: req.body.record });

  if (!record) return res.status(404).json({ msg: "Record not found" });

  let typeHash = {
    student: "Student",
    prof: "Professor",
    hod: "Professor",
    admin: "Admin"
  };

  await Reply.create({
    record: req.body.record,
    content: req.body.content,
    replierType: typeHash[req.user.role],
    by: req.user.id
  });

  return res.json({ msg: "Reply posted" });
});

module.exports = router;
