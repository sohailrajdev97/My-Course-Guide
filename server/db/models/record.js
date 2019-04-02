const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  course: {
    _id: false,
    type: Schema.Types.ObjectId,
    ref: "Course",
    index: true,
    required: true
  },
  type: {
    type: String, // "Review" or "Question"
    required: true
  },
  content: {
    type: String,
    required: true
  },
  student: {
    _id: false,
    type: Schema.Types.ObjectId,
    index: true,
    ref: "Student"
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  voteCount: {
    type: Number,
    default: 0
  }
});

mongoose.model("Record", recordSchema);
