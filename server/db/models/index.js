// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.

// NOTE: This is an example model which you are free to extend and build upon. Removing it is also perfectly OK!
require("./admin.js");
require("./course.js");
require("./department.js");
require("./professor.js");
require("./student.js");
