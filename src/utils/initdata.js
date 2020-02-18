// const uuidv4 = require('uuid/v4');
// console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const basicResponse = {
  "0": "GET /news",
  "1": "GET /news?(country=|tag=|headline=|earliestdate=|latestdate="
};

const mockFirstUser = {
  userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
  userName: `JJ.Jameson`,
  userType: `admin`,
  email: `jjadmin.email.com`,
  currentlyActive: true,
  lastActive: new Date(),
  commentActivity: {},
  browseActivity: {}
};

const mockSecondUser = {
  userId: `d0a57e59-6c22-49e7-b604-24ab03c2cf32`,
  username: `Peter Parker`,
  userType: `superuser`,
  email: `ppuser.email.com`,
  currentlyActive: true,
  lastActive: new Date(),
  commentActivity: {},
  browseActivity: {}
};

const mockQuery = {
  country: "US",
  headlines: "", //qinTitle
  tag: "trump",
  earliestDate: new Date("2019-12-16T18:00:39Z"),
  latestDate: new Date("2020-02-16T18:00:39Z")
};
const mockFirstCommentinFirstArticle = {
  id: `29b15e01-ac1c-4f4c-9d20-5501e942b648`,
  userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
  title: "D.Trump visiting Daytona",
  comment: `W.H.staff used old Daytona photos to fake the high attendance`,
};

const mockFirstArticle = {
  id: "f612f63d-cd07-441c-88cc-0041ac86f6e4",
  title:
    "Donald Trump and Melania Trump scheduled to take lap at Daytona 500, sources confirm",
  location: {
    coordinates: { lat: 31.9686, long: 99.9018 },
    country: "us",
    city: "texas"
  },
  publisher: {
    publishedAt: new Date("2020-02-16T18:00:39Z"),
    source: { id: "cnn", name: "CNN" },
    publishedAuthor: "Kate Bennett and Noah Gray, CNN"
  },
  tag: [],
  description:
    "Viewers should expect to see more than race cars on the Daytona 500 track today. A portion of the presidential motorcade, including President Donald Trump and first lady Melania Trump will be taking a lap around the Daytona 500 speedway before the start of th…",
  url: `https://www.cnn.com/2020/02/16/politics/donald-trump-melania-trump-daytona-500-nascar-race/index.html`,
  urlToImage: `https://cdn.cnn.com/cnnnext/dam/assets/200131190026-trump-leaves-white-house-0131-super-tease.jpg`,
  comments: []
};

const mockSecondArticle = {
  id: "23163ff4-28a1-4e85-b3e5-7628575945b2",
  title: "Seth Meyers pokes fun at Trump's weird obsession with badgers",
  location: {
    coordinates: { lat: 38.9072, long: 77.0369 },
    country: "us",
    city: "washingtondc"
  },
  publisher: {
    publishedAt: new Date("2020-02-14T03:49:38Z"),
    source: { id: "mashable", name: "Mashable" },
    publishedAuthor: "Amanda Yeo"
  },
  tag: [
    "BADGERS",
    "CULTURE",
    "DONALD TRUMP",
    "JUSTICE DEPARTMENT",
    "LATE NIGHT WITH SETH MEYERS",
    "POLITICS",
    "SETH MEYERS"
  ],
  description: `"This week we learned one of the strangest, dumbest things about Trump yet" Late Night host Seth Meyers said during Thursday's episode. It's an incredibly bold call, but it's fair to say this presidential factoid wasn't one anybody was expecting. Referring t…`,
  url: `https://mashable.com/video/seth-meyers-donald-trump-badgers/`,
  urlToImage: `https://mondrian.mashable.com/2020%252F02%252F14%252Ff5%252F1cbc8c6fbb2746b1991e4382b54c4531.0f916.png%252F1200x630.png?signature=kC9DybDrv58Kv90XeySOdhvmrQY=`,
  comments: []
};

const mockThirdArticle = {
  id: "f46d68cf-1ca4-4825-9ee2-967b3f3436b5",
  title:
    "These 12 Twitter posts show the insane queues for masks in Singapore, Shanghai and Hong Kong, which are all sold out",
  location: {
    coordinates: { lat: 22.3193, long: 114.1694 },
    country: "cn",
    city: "hong kong"
  },
  publisher: {
    publishedAt: new Date("2020-01-30T03:49:38.000Z"),
    source: { id: "businessinsider", name: "Business Insider" },
    publishedAuthor: "Rachel Genevieve Chia"
  },
  tag: [
    "coronavirus",
    "epidemic",
    "healthcare",
    "Hong Kong",
    "mask",
    "Singapore",
    "Queues",
    "Shanghai",
    "Shortage",
    "surgical mask",
    "Wuhan",
    "wuhan virus"
  ],
  description: `Est dolor consectetur ad laboris incididunt excepteur. Duis duis cillum id excepteur veniam Lorem est.`,
  url: `https://www.businessinsider.sg/photos-and-videos-show-insane-queues-for-masks-in-singapore-shanghai-and-hong-kong-which-netizens-say-are-all-sold-out/`,
  urlToImage: ``,
  comments: []
};

const mockArticleList = [mockFirstArticle, mockSecondArticle, mockThirdArticle];
const mockArticleFullMessage = {
  status: "ok",
  totalResults: 133350,
  articleslength: 3,
  articles: [mockFirstArticle, mockSecondArticle, mockThirdArticle]
};
const testArticles = {
  status: "ok",
  totalResults: 133350,
  articleslength: 50,
  articles: [
    {
      source: { id: "cnn", name: "CNN" },
      author: "Kate Bennett and Noah Gray, CNN",
      title:
        "Donald Trump and Melania Trump scheduled to take lap at Daytona 500, sources confirm",
      description:
        "Viewers should expect to see more than race cars on the Daytona 500 track today. A portion of the presidential motorcade, including President Donald Trump and first lady Melania Trump will be taking a lap around the Daytona 500 speedway before the start of th…",
      url: `https://www.cnn.com/2020/02/16/politics/donald-trump-melania-trump-daytona-500-nascar-race/index.html`,
      urlToImage: `https://cdn.cnn.com/cnnnext/dam/assets/200131190026-trump-leaves-white-house-0131-super-tease.jpg`,
      publishedAt: "2020-02-16T18:00:39Z",
      content:
        "(CNN)A portion of the presidential motorcade, including President Donald Trump and first lady Melania Trump, will take a lap around the speedway before the start of NASCAR's Daytona 500 on Sunday a source familiar with the event and a White House official con… [+962 chars]"
    },
    {
      source: { id: "mashable", name: "Mashable" },
      author: "Amanda Yeo",
      title: "Seth Meyers pokes fun at Trump's weird obsession with badgers",
      description: `"This week we learned one of the strangest, dumbest things about Trump yet" Late Night host Seth Meyers said during Thursday's episode. It's an incredibly bold call, but it's fair to say this presidential factoid wasn't one anybody was expecting. Referring t…`,
      url: `https://mashable.com/video/seth-meyers-donald-trump-badgers/`,
      urlToImage: `https://mondrian.mashable.com/2020%252F02%252F14%252Ff5%252F1cbc8c6fbb2746b1991e4382b54c4531.0f916.png%252F1200x630.png?signature=kC9DybDrv58Kv90XeySOdhvmrQY=`,
      publishedAt: "2020-02-14T03:49:38Z",
      content: `This week we learned one of the strangest, dumbest things about Trump yet," Late Night host Seth Meyers said during Thursday's episode. It's an incredibly bold call, but it's fair to say this presidential factoid wasn't one anybody was expecting.`
    }
  ]
};

module.exports = {
  basicResponse,
  mockFirstUser,
  mockSecondUser,
  mockFirstCommentinFirstArticle,
  mockQuery,
  mockFirstArticle,
  mockSecondArticle,
  mockArticleList,
  mockArticleFullMessage
};
// console.log(testArticles)
