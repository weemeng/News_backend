const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  username: String,
  userType: String, //enum = [admin, superuser, user]
  email: String,
  currentlyActive: Boolean,
  lastActive: Date,
  commentActivity: Object,
  browseActivity: Object
});

const QuerySchema = new mongoose.Schema({
  country: String,
  headline: String,
  tag: String,
  earliestDate: Date,
  latestDate: Date
});

const queryModel = mongoose.model("queryModel", QuerySchema);

module.exports = queryModel;