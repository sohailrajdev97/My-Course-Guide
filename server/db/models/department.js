const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: String,
  hod: {
    type: Schema.Types.ObjectId,
    ref: 'Professor'
  }
});

mongoose.model('Department', departmentSchema);
