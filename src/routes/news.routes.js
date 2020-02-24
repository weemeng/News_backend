const express = require("express");
const router = express.Router();
const NewsModel = require("../model/news.model");
const QueryModel = require("../model/query.model");
const { getUUID, getArticleIDMD5 } = require("../utils/generateId");
const { protectRoute } = require("../middleware/auth");
const { setLastActive, checkLoginSetUser } = require("../middleware/userMW");
const { parseQuery } = require("../API_external/newsAPIQuery");
const axios = require("axios");
const wrapAsync = require("../utils/wrapAsync")
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
      filter["$or"] = [
        { title: { $regex: guardTag, $options: "i" } },
        { description: { $regex: guardTag, $options: "i" } }
      ];
    }
    if (!!requestQuery.headline) {
      const guardHeadline = String(requestQuery.headline);
      filter.title = { $regex: guardHeadline, $options: "i" };
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

const getTags = async (source, url) => {
  switch (source) {
    // case "bbc news":
    //   return processTopicsBBC(data);
    // case "mashable":
    //   return processTopicsMashable(data);
    case "straitstimes.com":
      const { data } = await axios.get(url, { withCredentials: false });
      return await processTopicsStraitsTimes(data);
    // case "techcrunch":
    //   return processTopicsTechCrunch(data);
    default:
      return [];
    // console.log(`Sorry.. ${source} is not supported currently`);
  }
};

const newArticleParsingToSchemaFormat = async (article, country) => {
  const taglist = await getTags(article.source.name.toLowerCase(), article.url);
  const taglistLower = taglist.map(x => x.toLowerCase());
  let newsObject = {
    id: getArticleIDMD5(article.title),
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
      const parsedArticle = await newArticleParsingToSchemaFormat(
        article,
        country
      );
      await populateNewArticles(parsedArticle);
    })
  );
  return articles;
};

const updateDatabase = async apiQuery => {
  try {
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
  } catch (err) {
    console.log("Error Hit");
  }
};

router.get("/:id/comments", wrapAsync(async (req, res) => {
  const commentsList = await NewsModel.find({
    id: req.params.id,
    comments: {}
  });
  res.status(200).send(commentsList);
}));

router.post("/:id/comments", protectRoute, setLastActive, wrapAsync(async (req, res) => {
  const filterId = { id: req.params.id };
  const newComment = req.body;
  newComment["id"] = getArticleIDMD5(newComment.title);
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
}));

router.get("/", checkLoginSetUser, wrapAsync(async (req, res, next) => {
  const query = new QueryModel(req.query);
  await QueryModel.init();
  if (!!req.user) {
    query.userId = req.user.userId;
  }
  await query.save();
  const apiQuery = setAPISearchFilter(req.query);
  await updateDatabase(apiQuery);
  const dbQuery = setDBSearchFilter(req.query);
  const filteredArticles = await NewsModel.find(dbQuery)
    .limit(50)
    .sort({ "publisher.publishedAt": -1 });
  res.status(200).send(filteredArticles);
}));

module.exports = router;
