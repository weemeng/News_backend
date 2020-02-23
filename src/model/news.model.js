const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    userId: String,
    title: String,
    comment: String
  },
  {
    timestamps: true,
    _id : false
  }
);
const CoordinateSchema = {
  lat: {
    type: Number,
    min: -90,
    max: 90
  },
  long: {
    type: Number,
    min: -180,
    max: 180
  }
};
const LocationSchema = {
  coordinates: CoordinateSchema,
  country: {
    type: String,
    lowercase: true
  },
  city: {
    type: String,
    lowercase: true
  }
};
const PublisherSchema = {
  publishedAt: Date,
  source: Object,
  publishedAuthor: String
};

const NewsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: String,
  location: LocationSchema,
  tag: Array,
  publisher: PublisherSchema,
  comments: {
    type: [CommentSchema],
    default: undefined
  },
  url: String,
  urlToImage: String,
  description: String
});


const NewsModel = mongoose.model("newsModel", NewsSchema);

module.exports = NewsModel;
