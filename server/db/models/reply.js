const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  record: {
    _id: false,
    type: Schema.Types.ObjectId,
    ref: "Record",
    index: true,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  replierType: {
    type: String, // Either "Professor" or "Student"
    required: true
  },
  by: {
    _id: false,
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "replierType"
  },
  time: {
    type: Date,
    default: new Date()
  }
});

mongoose.model("Reply", replySchema);
