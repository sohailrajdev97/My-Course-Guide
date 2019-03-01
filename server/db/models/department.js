const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  campus: {
    type: String,
    required: true,
    index: true
  }
});

mongoose.model("Department", departmentSchema);
