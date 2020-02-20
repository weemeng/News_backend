const express = require("express");
const router = express.Router();
const NewsModel = require("../model/news.model");
const { getUUID, getArticleIDMD5 } = require("../../generateId");
const { protectRoute } = require("../middleware/auth");
const { setLastActive } = require("../middleware/userMW");
const { parseQuery } = require("../API_external/newsAPIQuery");
const axios = require("axios");

router.get("/:id/comments", async (req, res) => {
  const commentsList = await NewsModel.find({
    id: req.params.id,
    comments: {}
  });
  res.status(200).send(commentsList);
});

router.post("/:id/comments", protectRoute, setLastActive, async (req, res) => {
  console.log(req.user);
  const filterId = { id: req.params.id };
  const newComment = req.body;
  newComment["id"] = await getArticleIDMD5();
  const [newsOfId] = await NewsModel.find(filterId);
  newsOfId.comments.push(newComment);
  const updatedNews = await NewsModel.findOneAndUpdate(
    filterId,
    { comments: newsOfId.comments },
    { new: true, runValidators: true }
  );
  res.status(201).send(updatedNews.comments);
});

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
  }
  return filter;
};

// {
//   source: { id: null, name: 'Lifehacker.com' },
//   author: 'Josh Ocampo',
//   title: "What You Need to Know About the Senate Vote on Trump's Impeachment",
//   description: 'This week in politics, the
// Iowa caucuses went off without a hitch and President Trump boasted that the economy is the “ best it has ever been ” during last night’s State of the Union address. Read more...',
//   url: 'https://lifehacker.com/what-you-need-to-know-about-the-senate-vote-on-trumps-i-1841469583',
//   urlToImage: 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/kovtrsqd8rdsifm4t9r9.jpg',
//   publishedAt: '2020-02-05T18:30:00Z',
//   content: 'This week in politics, the Iowa caucuses went off without a hitch and President Trump boasted that the economy is the best it has ever been during last nights State of the Union address. \r\n' +
//     'In other news from the upside-down, this afternoon, Trumps Senate impe… [+1891 chars]'
// }

const getTags = async url => {
  
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
  articles.forEach(async article => {
    const parsedArticle = articleToNewDoc(article, country);
    await populateNewArticles(parsedArticle);
  });
  return articles;
};

const updateDatabase = async apiQuery => {
  const response = await axios.get(parseQuery(apiQuery));
  const { articles } = response.data;
  let countryVal = "";
  if (!!apiQuery.country) {
    countryVal = apiQuery.country;
  }
  if (!!articles.length) {
    await parseArticlesIntoDB(articles, countryVal);
  }
};

// router.get("/updateNews", async (req, res) => {
//   const apiQuery = setAPISearchFilter(req.query);
//   // const response = await axios.get(parseQuery(apiQuery));
//   // const { articles } = response.data;
//   // if (!!articles.length) {
//   //   await parseArticlesIntoDB(articles);
//   // }
//   res.status(200).send(articles);
// });

router.get("/", async (req, res, next) => {
  const apiQuery = setAPISearchFilter(req.query);
  await updateDatabase(apiQuery);
  const dbQuery = setDBSearchFilter(req.query);
  const filteredArticles = await NewsModel.find(dbQuery)
    // .sort({ "publisher.publishedAt": -1 })
    // .limit(50);
  res.status(200).send(filteredArticles);
});

module.exports = router;
