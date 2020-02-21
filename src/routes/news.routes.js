const express = require("express");
const router = express.Router();
const NewsModel = require("../model/news.model");
const QueryModel = require("../model/query.model");
const { getUUID, getArticleIDMD5 } = require("../utils/generateId");
const { protectRoute } = require("../middleware/auth");
const { setLastActive, checkLoginSetUser } = require("../middleware/userMW");
const { parseQuery } = require("../API_external/newsAPIQuery");
const axios = require("axios");
const {
  processTopicsMashable,
  processTopicsBBC,
  processTopicsStraitsTimes,
  processTopicsTechCrunch
} = require("../config/tags");

const setDBSearchFilter = requestQuery => {
  const filter = {};
  if (Object.entries(requestQuery).length !== 0) {
    if (!!requestQuery.country) {
      const guardCountry = String(requestQuery.country);
      filter["location.country"] = guardCountry;
    }
    if (!!requestQuery.tag) {
      const guardTag = String(requestQuery.tag);
      filter["tag"] = guardTag;
    }
    if (!!requestQuery.headline) {
      const guardHeadline = String(requestQuery.headline);
      filter["title"] = guardHeadline;
    }
    if (!!requestQuery.earliestDate || !!requestQuery.latestDate) {
      const dateFilter = {};
      if (!!requestQuery.earliestDate) {
        const date = new Date(requestQuery.earliestDate);
        dateFilter["$gt"] = date;
      }
      if (!!requestQuery.latestDate) {
        const date = new Date(requestQuery.latestDate);
        dateFilter["$lt"] = date;
      }
      filter["publisher.publishedAt"] = dateFilter;
    }
  }
  return filter;
};
const setAPISearchFilter = requestQuery => {
  const filter = {};
  if (Object.entries(requestQuery).length !== 0) {
    if (!!requestQuery.country) {
      const guardCountry = String(requestQuery.country);
      filter["country"] = guardCountry;
    }
    if (!!requestQuery.tag) {
      const guardTag = String(requestQuery.tag);
      filter["q"] = guardTag;
    }
    if (!!requestQuery.headline) {
      const guardHeadline = String(requestQuery.headline);
      filter["qInTitle"] = guardHeadline;
    }
    if (!!requestQuery.earliestDate) {
      const date = new Date(requestQuery.earliestDate);
      filter["earliestDate"] = date;
    }
    if (!!requestQuery.latestDate) {
      const date = new Date(requestQuery.latestDate);
      filter["latestDate"] = date;
    }
    filter["pageSize"] = 20;
  }
  return filter;
};

router.get("/:id/comments", async (req, res) => {
  const commentsList = await NewsModel.find({
    id: req.params.id,
    comments: {}
  });
  res.status(200).send(commentsList);
});

router.post("/:id/comments", protectRoute, setLastActive, async (req, res) => {
  const filterId = { id: req.params.id };
  const newComment = req.body;
  newComment["id"] = await getArticleIDMD5(newComment.title);
  const [newsOfId] = await NewsModel.find(filterId);
  newsOfId.comments.push(newComment);
  const updatedNews = await NewsModel.findOneAndUpdate(
    filterId,
    { comments: newsOfId.comments },
    { new: true, runValidators: true }
  );
  res.status(201).send(updatedNews.comments);
});

const getTags = async (source, url) => {
  switch (source) {
    case "bbc news":
      return processTopicsBBC(url);
    case "mashable":
      return processTopicsMashable(url);
    case "straitstimes.com":
      console.log("In Straits Times");
      const arrayoutput = await processTopicsStraitsTimes(url);
      console.log(arrayoutput);
      return arrayoutput;
    case "techcrunch":
      return processTopicsTechCrunch(url);
    default:
    // console.log(`Sorry.. ${source} is not supported currently`);
  }
};

const articleToNewDoc = (article, country) => {
  const newsObject = {
    id: getArticleIDMD5(article.title),
    title: article.title,
    location: {
      country: country
    },
    publisher: {
      publishedAt: article.publishedAt,
      source: article.source
    },
    tags: getTags(article.source.name.toLowerCase(), article.url),
    url: article.url,
    urlToImage: article.urlToImage,
    description: article.description
  };
  return newsObject;
};

const populateNewArticles = async article => {
  try {
    const art = new NewsModel(article);
    await NewsModel.init();
    await art.save();
  } catch (err) {
    if (err.code === 11000) {
      console.log("Skipping... Entry is already in Database");
    }
  }
};

const parseArticlesIntoDB = async (articles, country) => {
  await Promise.all(
    articles.map(async article => {
      const parsedArticle = articleToNewDoc(article, country);
      await populateNewArticles(parsedArticle);
    })
  );
  return articles;
};

const updateDatabase = async apiQuery => {
  const response = await axios.get(parseQuery(apiQuery));
  if (!response.data) {
    return;
  }
  const { articles } = response.data;
  let countryVal = "";
  if (!!apiQuery.country) {
    countryVal = apiQuery.country;
  }
  if (!!articles.length) {
    await parseArticlesIntoDB(articles, countryVal);
  }
};

router.get("/", checkLoginSetUser, async (req, res, next) => {
  const query = new QueryModel(req.query);
  await QueryModel.init();
  if (!!req.user) {
    query.userId = req.user.userId;
  }
  await query.save();

  const apiQuery = setAPISearchFilter(req.query);
  // console.log(apiQuery);
  await updateDatabase(apiQuery);
  const dbQuery = setDBSearchFilter(req.query);
  const filteredArticles = await NewsModel.find(dbQuery)
    // .sort({ "publisher.publishedAt": -1 })
    .limit(50);
  // console.log(dbQuery)
  // console.log(filteredArticles)
  res.status(200).send(filteredArticles);
});

module.exports = router;
