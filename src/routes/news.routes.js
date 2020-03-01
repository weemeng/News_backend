const express = require("express");
const router = express.Router();
const NewsModel = require("../model/news.model");
const QueryModel = require("../model/query.model");
const { protectRoute } = require("../middleware/auth.mw");
const {
  updateUserLastActive,
  checkLoginSetUser
} = require("../middleware/user.mw");
const { parseQuery } = require("../API_external/newsAPIQuery");
const axios = require("axios");
const md5 = require("md5");
const wrapAsync = require("../utils/wrapAsync");
const getNewsTags = require("../config/tags");

const setDBSearchFilter = requestQuery => {
  const filter = {};
  if (Object.entries(requestQuery).length !== 0) {
    !!requestQuery.country && (filter["location.country"] = String(requestQuery.country));
    !!requestQuery.headline && (filter.title = { $regex: String(requestQuery.headline), $options: "i" });
    !!requestQuery.q && (filter["$or"] = [
        { title: { $regex: requestQuery.q, $options: "i" } },
        { description: { $regex: requestQuery.q, $options: "i" } }
      ]);
    !!requestQuery.earliestDate && (filter["publisher.publishedAt.$gt"] = new Date(requestQuery.earliestDate));
    !!requestQuery.latestDate && (filter["publisher.publishedAt.$lt"] = new Date(requestQuery.latestDate));
  }
  return filter;
};
const setAPISearchFilter = requestQuery => {
  const filter = {};
  if (Object.entries(requestQuery).length !== 0) {
    for (const keys in requestQuery) {
      if (keys == "earliestDate" || keys == "latestDate") {
        filter[keys] = new Date(requestQuery[keys]);
      }
      filter[keys] = requestQuery[keys];
    }
    filter["pageSize"] = 20;
  }
  return filter;
};

const newArticleParsingToSchemaFormat = async (article, country) => {
  // const taglist = await getNewsTags(
  //   article.source.name.toLowerCase(),
  //   article.url
  // );
  const taglist = [];
  const taglistLower = taglist.map(x => x.toLowerCase());
  let newsObject = {
    id: md5(article.title),
    title: article.title,
    location: {
      country: country
    },
    publisher: {
      publishedAt: article.publishedAt,
      source: article.source
    },
    tag: taglistLower,
    url: article.url,
    urlToImage: article.urlToImage,
    description: article.description
  };
  return newsObject;
};

const updateDatabase = async (req, res, next, apiQuery) => {
  const response = await axios.get(parseQuery(apiQuery));
  if (!response.data) {
    return;
  }
  const { articles } = response.data;
  let country = "";
  if (!!apiQuery.country) {
    country = apiQuery.country;
  }
  if (!!articles.length) {
    await Promise.all(
      articles.map(async article => {
        const parsedArticle = await newArticleParsingToSchemaFormat(
          article,
          country
        );
        try {
          const art = new NewsModel(parsedArticle);
          await NewsModel.init();
          await art.save();
        } catch (err) {
          if (err.code === 11000) {
            console.log("Skipping... Entry is already in Database");
          }
        }
      })
    );
  }
};

router.get(
  "/:id/comments",
  wrapAsync(async (req, res) => {
    const commentsList = await NewsModel.find({
      id: req.params.id,
      comments: {}
    });
    res.status(200).send(commentsList);
  })
);

router.post(
  "/:id/comments",
  protectRoute,
  updateUserLastActive,
  wrapAsync(async (req, res) => {
    const filterId = { id: req.params.id };
    const newComment = req.body;
    newComment["id"] = md5(newComment.title);
    newComment["userId"] = req.user.userId;
    const [newsOfId] = await NewsModel.find(filterId);
    if (newsOfId.comments === undefined) {
      newsOfId.comments = [];
    }
    newsOfId.comments.push(newComment);
    const updatedNews = await NewsModel.findOneAndUpdate(
      filterId,
      { comments: newsOfId.comments },
      { new: true, runValidators: true }
    );
    res.status(201).send(updatedNews.comments);
  })
);

router.get(
  "/",
  checkLoginSetUser,
  wrapAsync(async (req, res, next) => {
    const query = new QueryModel(req.query);
    await QueryModel.init();
    if (!!req.user) {
      query.userId = req.user.userId;
    }
    await query.save();
    const apiQuery = setAPISearchFilter(req.query);
    console.log(apiQuery);
    await updateDatabase(req, res, next, apiQuery);
    const dbQuery = setDBSearchFilter(req.query);
    const filteredArticles = await NewsModel.find(dbQuery)
      .limit(50)
      .sort({ "publisher.publishedAt": -1 });
    res.status(200).send(filteredArticles);
  })
);

module.exports = router;
