const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  course: {
    _id: false,
    type: Schema.Types.ObjectId,
    ref: "Course",
    index: true,
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
  }
});

mongoose.model("Review", reviewSchema);
