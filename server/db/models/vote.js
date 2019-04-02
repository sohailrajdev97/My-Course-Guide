const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review"
  },
  upvotes: [
    {
      _id: false,
      type: Schema.Types.ObjectId,
      default: [],
      ref: "Student"
    }
  ],
  downvotes: [
    {
      _id: false,
      type: Schema.Types.ObjectId,
      default: [],
      ref: "Student"
    }
  ]
});

mongoose.model("Vote", voteSchema);
