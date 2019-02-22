const express = require('express');
const router = express.Router();

const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const jwt = require('jsonwebtoken');

passport.use(new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

router.get("/", passport.authenticate("google-token", { session: false }), (req, res, next) => {
  let token = jwt.sign({ email: req.user.emails[0].value }, process.env.JWT_SECRET);;
  return res.json({ token });
});

module.exports = router;
