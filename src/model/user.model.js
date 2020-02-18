const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String, 
    enum: ["admin", "superuser", "user"],
    required: true,
  },
  email: String,
  currentlyActive: Boolean,
  lastActive: Date,
  commentActivity: Object,
  browseActivity: Object
});

const userModel = mongoose.model("userModel", UserSchema);

module.exports = userModel;