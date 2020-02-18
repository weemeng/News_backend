const PORT = 3000;
const app = require("./app");
require("./utils/db");
const NewsModel = require("./model/news.model");
const {
  basicResponse,
  mockUser,
  mockQuery,
  mockFirstArticle,
  mockSecondArticle,
  mockThirdArticle,
  mockArticleList,
  mockArticleFullMessage
} = require("./utils/initdata");

const populateFirstArticle = async article => {
  try {
    await NewsModel.create(article);
  } catch (err) {
    // console.log(err.message);
  }
};

populateFirstArticle(mockArticleList).then(
  console.log("populated the First article")
);

const server = app.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
