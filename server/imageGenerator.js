const express = require("express");
const router = express.Router();

const jdenticon = require("jdenticon")

router.get("/courses/:id", (req, res, next) => {
  let png = jdenticon.toPng(req.params.id, 100);
  res.writeHead(200, {
    "Content-Type": "image/png"
  });
  res.end(png);
});

module.exports = router;
