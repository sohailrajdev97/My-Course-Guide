const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Vote = mongoose.model("Vote");
const checkToken = require("./authMiddleware");

router.get("/", checkToken("student"), async (req, res, next) => {
  try {
    let upvotes = await Vote.find({ upvotes: req.user.id }).select({
      _id: 0,
      for: 1,
      forModel: 1
    });
    let downvotes = await Vote.find({ downvotes: req.user.id }).select({
      _id: 0,
      for: 1,
      forModel: 1
    });
    let response = {
      Record: {},
      Reply: {}
    };
    upvotes.forEach(vote => {
      response[vote.forModel][vote.for] = "up";
    });
    downvotes.forEach(vote => {
      response[vote.forModel][vote.for] = "down";
    });
    return res.json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

router.post("/:type", checkToken("student"), async (req, res, next) => {
  if (req.params.type !== "up" && req.params.type !== "down")
    return res.status(404).send();

  if (!req.body.record && !req.body.reply)
    return res.json(400, { msg: "Supply a record / reply id in request body" });

  let parentType = req.body.reply ? "Reply" : "Record";
  let parentModel = mongoose.model(parentType);
  let parentId = req.body.reply || req.body.record;

  try {
    let parent = await parentModel.findOne({ _id: parentId });

    if (!parent) return res.status(404).json({ msg: "Parent not found" });

    let vote = await Vote.findOne({ for: parentId });

    if (vote.upvotes.indexOf(req.user.id) >= 0 && req.params.type === "up") {
      vote = await Vote.findOneAndUpdate(
        { for: parentId },
        { $pull: { upvotes: req.user.id } },
        { new: true }
      );
      res.json({ msg: "Removed upvote" });
    } else if (
      vote.downvotes.indexOf(req.user.id) >= 0 &&
      req.params.type === "down"
    ) {
      vote = await Vote.findOneAndUpdate(
        { for: parentId },
        { $pull: { downvotes: req.user.id } },
        { new: true }
      );
      res.json({ msg: "Removed downvote" });
    } else if (req.params.type === "up") {
      vote = await Vote.findOneAndUpdate(
        { for: parentId },
        { $push: { upvotes: req.user.id }, $pull: { downvotes: req.user.id } },
        { new: true }
      );
      res.json({ msg: "Upvote added" });
    } else {
      vote = await Vote.findOneAndUpdate(
        { for: parentId },
        { $push: { downvotes: req.user.id }, $pull: { upvotes: req.user.id } },
        { new: true }
      );
      res.json({ msg: "Downvote added" });
    }

    // TODO: Update the count after acquiring a lock / use mongoose versioning middleware
    await parentModel.updateOne(
      { _id: parentId },
      {
        $set: { upvotes: vote.upvotes.length, downvotes: vote.downvotes.length }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Request Failed" });
  }
});

module.exports = router;
