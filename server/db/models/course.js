const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  id: {
    type: String,
    index: {
      unique: true
    }
  },
  name: {
    type: String
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

// This registers the model into mongoose so that anywhere else in your server you can do
/*
`const User = mongoose.model('Course');`
`User.update(...)`
*/
mongoose.model("Course", courseSchema);
