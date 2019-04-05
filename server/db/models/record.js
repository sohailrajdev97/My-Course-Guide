const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema(
  {
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
    },
    rating: {
      difficulty: {
        type: Number,
        max: 5,
        min: 0
      },
      attendance: {
        type: Number,
        max: 5,
        min: 0
      },
      grading: {
        type: Number,
        max: 5,
        min: 0
      },
      textbook: {
        type: Number,
        max: 5,
        min: 0
      },
      overall: {
        type: Number,
        max: 5,
        min: 0
      }
    }
  },
  {
    timestamps: true
  }
);

recordSchema.pre("find", function(next) {
  this.populate({ path: "student", select: "name" });
  this.select("type content voteCount isAnonymous createdAt");
  this.sort("-createdAt");
  next();
});

mongoose.model("Record", recordSchema);
