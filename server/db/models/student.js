const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: String,
  id: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  campus: {
    type: String,
    index: true
  },
  courses: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
      },
      year: Number,
      semester: Number
    }
  ]
});

mongoose.model('Student', studentSchema);
