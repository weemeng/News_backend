const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  userId: String,
  country: String,
  headline: String,
  tag: String,
  earliestDate: Date,
  latestDate: Date
},{
  timestamps: true,
});

const queryModel = mongoose.model("queryModel", QuerySchema);

module.exports = queryModel;