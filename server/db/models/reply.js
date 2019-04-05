const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
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
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

replySchema.pre("find", function(next) {
  this.populate({ path: "by", select: { _id: 0, name: 1, id: 1 } });
  next();
});

mongoose.model("Reply", replySchema);
