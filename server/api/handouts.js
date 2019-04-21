const express = require("express");
const router = express.Router();

const checkToken = require("./authMiddleware");
const path = require("path");
const fs = require("fs");

router.get(
  "/:file",
  checkToken(["admin", "student", "prof", "hod"]),
  (req, res, next) => {
    let file = path.join(process.cwd(), "server", "handouts", req.params.file);
    if (fs.existsSync(file)) {
      return res.download(file);
    } else {
      return res.json(404, { msg: "Handout not found" });
    }
  }
);

module.exports = router;
