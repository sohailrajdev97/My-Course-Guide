const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  forModel: {
    type: String,
    required: true,
    enum: ["Record", "Reply"]
  },
  for: {
    type: Schema.Types.ObjectId,
    index: true,
    refPath: "onModel"
  },
  upvotes: [
    {
      _id: false,
      type: Schema.Types.ObjectId,
      default: [],
      index: true,
      ref: "Student"
    }
  ],
  downvotes: [
    {
      _id: false,
      type: Schema.Types.ObjectId,
      default: [],
      index: true,
      ref: "Student"
    }
  ]
});

mongoose.model("Vote", voteSchema);
