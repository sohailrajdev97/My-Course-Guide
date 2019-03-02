const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const professorSchema = new Schema({
  name: String,
  email: {
    type: String,
    index: {
      unique: true
    }
  },
  campus: {
    type: String,
    index: true
  },
  department: {
    type: String,
    required: true
  },
  hod: {
    type: Boolean,
    default: false
  }
});

mongoose.model("Professor", professorSchema);
