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
  history: [
    {
      _id: false,
      year: Number,
      semester: Number,
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
  this.select("id name campus history.year history.semester");
  this.sort("id");
  next();
});

courseSchema.pre("findOne", function(next) {
  this.populate("history.professor");
  this.select("id name campus history.year history.semester");
  next();
});

// This registers the model into mongoose so that anywhere else in your server you can do
/*
`const Course = mongoose.model('Course');`
`Course.update(...)`
*/
mongoose.model("Course", courseSchema);
