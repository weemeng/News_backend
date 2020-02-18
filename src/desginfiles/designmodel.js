const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  country: String,
  headlines: String,
  tags: String,
  earliestDate: Date,
  latestDate: Date
});

const queryModel = mongoose.model("queryModel", QuerySchema);

module.exports = queryModel;