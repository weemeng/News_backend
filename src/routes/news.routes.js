const express = require("express");
const router = express.Router();
const NewsModel = require("../model/news.model");
const generateId = require("../../generateId");
const { mockArticles } = require("../utils/initdata");

router.get("/:id/comments", async (req, res) => {
  const commentsList = await NewsModel.find({
    id: req.params.id,
    comments: {}
  });
  res.status(200).send(commentsList);
});

router.post("/:id/comments", async (req, res) => {
  const filterId = { id: req.params.id };
  const newComment = req.body;
  newComment["id"] = await generateId();
  const [newsOfId] = await NewsModel.find(filterId);
  //newsOfId.comments
  newsOfId.comments.push(newComment);
  const updatedNews = await NewsModel.findOneAndUpdate(
    filterId,
    { comments: newsOfId.comments },
    { new: true, runValidators: true }
  );
  res.status(201).send(updatedNews.comments);
});

router.use("/", (req, res, next) => {
  const filter = {};
  if (Object.entries(req.query).length !== 0) {
    if (!!req.query.country) {
      const guardCountry = String(req.query.country);
      filter["location.country"] = guardCountry;
    }
    if (!!req.query.tag) {
      const guardTag = String(req.query.tag);
      filter["tag"] = guardTag;
    }
    if (!!req.query.headline) {
      const guardHeadline = String(req.query.headline);
      filter["title"] = guardHeadline;
    }
    if (!!req.query.earliestDate || !!req.query.latestDate) {
      const dateFilter = {};
      if (!!req.query.earliestDate) {
        const date = new Date(req.query.earliestDate);
        dateFilter["$gt"] = date;
      }
      if (!!req.query.latestDate) {
        const date = new Date(req.query.latestDate);
        dateFilter["$lt"] = date;
      }
      filter["publisher.publishedAt"] = dateFilter;
    }
  }
  res.locals.query = filter;
  next();
});
router.route("/").get(async (req, res) => {
  const filteredArticles = await NewsModel.find(res.locals.query);
  res.status(200).send(filteredArticles);
});

module.exports = router;
