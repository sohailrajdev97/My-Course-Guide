const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  id: {
    type: String,
    index: true
  },
  name: {
    type: String
  },
  campus: {
    type: String,
    required: true
  },
  numQuestions: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  averages: {
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
  },
  history: [
    {
      _id: false,
      year: Number,
      semester: Number,
      handout: {
        type: String,
        default: null
      },
      professor: {
        _id: false,
        type: Schema.Types.ObjectId,
        ref: "Professor"
      }
    }
  ]
});

courseSchema.pre("find", function(next) {
  this.populate("history.professor");
  this.select(
    "id name campus history.year history.semester history.handout numQuestions numReviews"
  );
  this.sort("id");
  next();
});

courseSchema.pre("findOne", function(next) {
  this.populate("history.professor");
  this.select(
    "id name campus history.year history.semester history.handout numQuestions numReviews"
  );
  next();
});

// This registers the model into mongoose so that anywhere else in your server you can do
/*
`const Course = mongoose.model('Course');`
`Course.update(...)`
*/
mongoose.model("Course", courseSchema);
