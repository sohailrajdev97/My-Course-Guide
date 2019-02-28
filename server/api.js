const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const _ = require("lodash");
const auth = require("./auth");

const { Department } = require("./db/models/department");
const { Professor } = require("./db/models/professor");

router.all("/", (req, res, next) => {
  console.log(`${req.method} for ${req.url}`);
  next();
});

router.use("/auth", auth);

router.use("/", bodyParser.json());

router.post("/departments", async (req, res) => {
  const body = _.pick(req.body, ["name", "campus", "hod"]);
  try {
    body.hod = await Professor.findOne({ email: body.hod });
  } catch (err) {
    delete body.hod;
  } // don't care if hod doesn't exist yet

  let dept = null;
  // get department from parameters
  try {
    dept = await Department.findOne({ name: body.name, campus: body.campus });
  } catch (err) {}
  // create the department if it doesn't exist
  if (!dept) {
    dept = new Department(body);
  }

  try {
    await dept.save();
    res.send(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
