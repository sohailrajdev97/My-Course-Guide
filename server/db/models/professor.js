const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const professorSchema = new Schema({
  name: String,
  email: {
    type: String,
    index: true
  },
  campus: {
    type: String,
    index: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department"
  }
});

mongoose.model("Professor", professorSchema);
