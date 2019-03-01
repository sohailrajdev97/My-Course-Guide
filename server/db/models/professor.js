const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const professorSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    index: true
  },
  campus: {
    type: String,
    index: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department"
  },
  hod: {
    type: Boolean,
    default: false
  }
});

mongoose.model("Professor", professorSchema);
