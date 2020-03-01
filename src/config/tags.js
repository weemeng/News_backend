const cheerio = require("cheerio");
const wrapAsync = require("../utils/wrapAsync");
const axios = require("axios")

const restStringAndReturn = wrapAsync(async htmlString => {
  if (!htmlString) {
    return;
  }
  return await cheerio.load(htmlString);
});
const processTopicsBBC = wrapAsync(async htmlString => {
  const $ = await restStringAndReturn(htmlString);
  const tagCollection = [];
  const marketData = $('li[data-entityid="tags-list__tags"]').find("a");
  //   console.log($(".tags-list__tags").html());
  marketData.each(function(index, element) {
    tagCollection.push($(element).text());
  });
  return tagCollection;
});
const processTopicsMashable = wrapAsync(async htmlString => {
  const $ = await restStringAndReturn(htmlString);
  const tagCollection = [];
  const marketData = $(".article-topics").find("a");
  //   console.log($(".tags-list__tags").html());
  marketData.each(function(index, element) {
    tagCollection.push($(element).text());
  });
  return tagCollection;
});
const processTopicsStraitsTimes = wrapAsync(async htmlString => {
  const $ = await restStringAndReturn(htmlString);
  const marketData = $(".story-keywords > ul > li > a");
  const tagCollection = [];
  for (let i = 0; i < marketData.length; i++) {
    tagCollection.push(marketData[i].children[0].data);
  }
  return tagCollection;
});
const processTopicsTechCrunch = wrapAsync(async htmlString => {
  const $ = await restStringAndReturn(htmlString);
  const tagCollection = [];
  const marketData = $('li[class="menu__item "]').find("a");
  console.log($(`li[class="menu__item "]`).find("a"));
  marketData.each(function(index, element) {
    tagCollection.push($(element).text());
  });
  return tagCollection;
});
const getNewsTags = async (source, url) => {
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
    alert(`Sorry.. ${source} is not supported currently`);
  }
};
module.exports = getNewsTags
