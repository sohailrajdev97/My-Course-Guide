const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: String,
  email: {
    type: String,
    index: true
  }
});

mongoose.model("Admin", adminSchema);
