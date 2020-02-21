const uuidv4 = require("uuid/v4");
const getUUID = () => {
  return uuidv4();
};


const md5 = require("md5")
const getArticleIDMD5 = (string) => {
  return md5(string)
}
// console.log(getUUID())
// console.log(getArticleIDMD5())
module.exports = {getUUID, getArticleIDMD5};
