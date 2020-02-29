// eg, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za
require("dotenv").config();

const QueryParamDefault = {
  country: "",
  category: "",
  q: "trump",
  qInTitle: "",
  pageSize: 50,
  earliestDate: Date(),
  latestDate: Date(),
  apiKey: process.env.NEWSAPI_SECRET_KEY
};

const setQueryStringEverythingEndpoint = query => {
  const baseString = "https://newsapi.org/v2/everything?";
  const queryFilterKey = ["q", "qInTitle", "from", "to", "language", "pageSize"]
  const queryString = [];
  for (const keys in query) {
    
  }
  
  
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
    queryString.push(`pageSize=50`);
  }
  queryString.push(`apiKey=${process.env.NEWSAPI_SECRET_KEY}`);
  return baseString + queryString.join("&");
};

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
    queryString.push(`pageSize=50`);
  }
  queryString.push(`apiKey=${process.env.NEWSAPI_SECRET_KEY}`);
  return baseString + queryString.join("&");
};

const parseQuery = QueryParam => {
  let param = QueryParam
  if (Object.keys(param).length == 0) {
    param = QueryParamDefault;
  }
  return !!param.country
    ? setQueryStringHeadlinesEndpoint(param)
    : setQueryStringEverythingEndpoint(param);
};

module.exports = { parseQuery, QueryParamDefault };
