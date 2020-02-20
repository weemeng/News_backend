require("dotenv").config();
const port = process.env.PORT || 3000;
const app = require("./app");
require("./utils/db");
const NewsModel = require("./model/news.model");
const UserModel = require("./model/user.model");
const { mockUserList, mockArticleList } = require("./utils/initdata");

const populateArticleList = async article => {
  try {
    await NewsModel.create(article);
  } catch (err) {
    // console.log(err.message);
  }
};

const populateUserList = async user => {
  try {
    await UserModel.create(user);
  } catch (err) {
    // console.log(err);
  }
};

// populateArticleList(mockArticleList).then(
//   console.log("populated the First article")
// );
// populateUserList(mockUserList).then(console.log("Lock and Load"));

const server = app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}`);
});
