const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userPicList: [String],
  notes: [String],
});

module.exports = mongoose.model("User", userSchema);


//Generally you wanna make user pic list an array of other mongoose models
// We're gonna need another model called images
//Each image at minimum will need a URL string and Array of Notes strings
//UserPicList could be an array of the images but each image is going to be it's own schema
//LOOK UP SUB DOCUMENTS on GOOGLE
//LOOK AT CLASS NOTES FOR SCHEMA