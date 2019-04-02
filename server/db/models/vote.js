const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  record: {
    type: Schema.Types.ObjectId,
    ref: "Record"
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
