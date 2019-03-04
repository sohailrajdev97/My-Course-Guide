const express = require("express");
const router = express.Router();

const passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Professor = mongoose.model("Professor");
const Student = mongoose.model("Student");
const Admin = mongoose.model("Admin");

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

router.get(
  "/",
  passport.authenticate("google-token", { session: false }),
  async (req, res, next) => {
    let payload = {
      name: req.user._json.name,
      email: req.user.emails[0].value,
      picture: req.user._json.picture
    };

    let admin = await Admin.findOne({ email: payload.email });

    if (admin) {
      payload.role = "admin";
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 21600 // 6 hours
      });

      return res.json({ token });
    }

    let professor = await Professor.findOne({ email: payload.email });

    if (professor) {
      if (professor.hod) {
        payload.role = "hod";
      } else {
        payload.role = "prof";
      }
      payload.campus = professor.campus;
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 21600 // 6 hours
      });

      return res.json({ token });
    }

    let student = await Student.findOne({ email: payload.email });

    if (student) {
      payload.role = "student";
      payload.campus = student.campus;
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 21600 // 6 hours
      });

      return res.json({ token });
    }

    return res.status(401).json({});
  }
);

module.exports = router;
