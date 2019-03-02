const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: process.env.UPLOAD_DIR });

router.post("/", upload.single("csv"), (req, res, next) => {
  if (req.file.mimetype != "text/csv") {
    res.status(400).json({
      msg: "Only CSV files are allowed"
    });
  }
});

module.exports = router;
