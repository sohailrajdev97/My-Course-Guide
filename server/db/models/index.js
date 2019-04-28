// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.

require("./admin.js");
require("./course.js");
require("./professor.js");
require("./record.js");
require("./reply.js");
require("./student.js");
require("./vote.js");
require("./report.js");
