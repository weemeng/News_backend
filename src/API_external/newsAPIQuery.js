// eg, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za
require("dotenv").config();

const QueryParam = {
  country: "",
  category: "",
  q: "trump",
  qInTitle: "",
  pageSize: 20,
  earliestDate: Date(),
  latestDate: Date(),
  apiKey: process.env.NEWSAPI_SECRET_KEY
};

const setQueryStringEverythingEndpoint = query => {
  const baseString = "https://newsapi.org/v2/everything?";
  const queryString = [];
  if (!!query.q) {
    queryString.push(`q=${query.q}`);
  }
  if (!!query.qInTitle) {
    queryString.push(`qInTitle=${query.qInTitle}`);
  }
  if (!!query.from) {
    queryString.push(`from=${query.from}`);
  }
  if (!!query.to) {
    queryString.push(`to=${query.to}`);
  }
  if (!!query.language) {
    queryString.push(`language=${query.language}`);
  }
  if (!!query.pageSize) {
    queryString.push(`pageSize=20`);
  }
  queryString.push(`apiKey=${process.env.NEWSAPI_SECRET_KEY}`);
  return baseString + queryString.join("&");
};
// type1
// q = keywords or phrases for the in article in the title or body
// qInTitle = keywords or phrases to search for in the title
// from  = ISO8601 FormData
// to = ISO8601 FormData 2020-02-19 or 2020-02-19T10:45:31
// language = [en, fr, es]
// pageSize = 50;

const setQueryStringHeadlinesEndpoint = query => {
  const baseString = "https://newsapi.org/v2/top-headlines?";
  const queryString = [];
  if (!!query.category) {
    queryString.push(`q=${query.category}`);
  }
  if (!!query.q) {
    queryString.push(`q=${query.q}`);
  }
  if (!!query.country) {
    queryString.push(`country=${query.country}`);
  }
  if (!!query.language) {
    queryString.push(`language=${query.language}`);
  }
  if (!!query.pageSize) {
    queryString.push(`pageSize=20`);
  }
  queryString.push(`apiKey=${process.env.NEWSAPI_SECRET_KEY}`);
  return baseString + queryString.join("&");
};

// type2
// category = [business, entertainment, general, health, science, sports, technology];
// language = [ar, de, en, es, fr, he, it, nl, no, pt, ru, se, ud, zh]
// const countryList = ["ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu", "cz", "de"]
// country = [ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za]

const parseQuery = QueryParam => {
  return !!QueryParam.country
    ? setQueryStringHeadlinesEndpoint(QueryParam)
    : setQueryStringEverythingEndpoint(QueryParam);
};

console.log(parseQuery(QueryParam));

module.exports = { parseQuery, QueryParam };
