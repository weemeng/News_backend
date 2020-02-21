const basicResponse = {
  "0": "GET /news",
  "1": "GET /news?(country=|tag=|headline=|earliestdate=|latestdate="
};

const createThirdUser = {
  username: `MaryJ`,
  userType: `user`,
  password: `asdfghjkl`,
  email: `mjuser.email.com`,
  commentActivity: {},
  browseActivity: {}
};

const mockFirstUser = {
  userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
  username: `JJJameson`,
  userType: `admin`,
  password: `asdfghjkl`,
  email: `jjadmin.email.com`,
  currentlyActive: true,
  lastActive: new Date().toISOString(),
  commentActivity: {},
  browseActivity: {}
};

const mockSecondUser = {
  userId: `d0a57e59-6c22-49e7-b604-24ab03c2cf32`,
  username: `Peter Parker`,
  userType: `superuser`,
  password: `987654321`,
  email: `ppuser.email.com`,
  currentlyActive: true,
  lastActive: new Date().toISOString(),
  commentActivity: {},
  browseActivity: {}
};

const mockUserList = [mockFirstUser, mockSecondUser];

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
  comment: `W.H.staff used old Daytona photos to fake the high attendance`
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
    publishedAt: new Date("2020-01-16T18:00:39Z"),
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
    "Coronavirus is like flu, spreads more easily than thought: Study - The Straits Times",
  location: {
    coordinates: { lat: 1.3521, long: 103.8198 },
    country: "sg",
    city: "singapore"
  },
  publisher: {
    publishedAt: new Date("2020-02-20T13:27:01Z"),
    source: { id: null, name: "Straitstimes.com" },
    publishedAuthor: "hermesauto"
  },
  tag: ["wuhan", "coronavirus"],
  description: `. Read more at straitstimes.com.`,
  url: `https://www.straitstimes.com/asia/se-asia/coronavirus-can-transmit-via-aerosol-chinese-health-authorities`,
  urlToImage:
    "https://www.straitstimes.com/sites/default/files/styles/x_large/public/articles/2020/02/20/yq-cornchina020022021.jpg?itok=zIFnthJC",
  comments: []
};

const mockFourthArticle = {
  id: "7cdd8ef8-0ed6-409e-b05b-f639fea2925e",
  title:
    "6 SAF servicemen charged in military court over death of NSF Dave Lee - CNA",
  location: {
    coordinates: { lat: 1.3521, long: 103.8198 },
    country: "sg",
    city: "singapore"
  },
  publisher: {
    publishedAt: new Date("2020-02-20T10:11:56Z"),
    source: { id: null, name: "Channelnewsasia.com" },
    publishedAuthor: "CNA"
  },
  tag: ["wuhan", "coronavirus"],
  description:
    "SINGAPORE: Six Singapore Armed Forces (SAF) servicemen were charged in military court on Thursday (Feb 20) over the death of Corporal First Class (CFC) Dave Lee.",
  url:
    "https://www.channelnewsasia.com/news/singapore/nsf-death-dave-lee-saf-servicemen-charged-military-court-mindef-12454468",
  urlToImage:
    "https://cna-sg-res.cloudinary.com/image/upload/q_auto,f_auto/image/10194894/16x9/991/557/4e26aca86c902d031bf33596dad8dc69/uz/nsf-lee-han-xuan-dave-wake--1-.jpg",
  comments: []
};

const mockDBArticleList = [
  mockFirstArticle,
  mockSecondArticle,
  mockThirdArticle,
  mockFourthArticle
];

const mockArticleFullMessage = {
  status: "ok",
  totalResults: 133350,
  articleslength: 4,
  articles: [
    mockFirstArticle,
    mockSecondArticle,
    mockThirdArticle,
    mockFourthArticle
  ]
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

const mockUsApiArticleList = {
  data: {
    status: "ok",
    totalResults: 133350,
    articleslength: 2,
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
  }
};
const mockSgApiArticleList = {
  data: {
    status: "ok",
    totalResults: 133350,
    articleslength: 2,
    articles: [
      {
        source: {
          id: null,
          name: "Straitstimes.com"
        },
        author: "hermesauto",
        title:
          "Coronavirus is like flu, spreads more easily than thought: Study - The Straits Times",
        description: ". Read more at straitstimes.com.",
        url:
          "https://www.straitstimes.com/asia/se-asia/coronavirus-can-transmit-via-aerosol-chinese-health-authorities",
        urlToImage:
          "https://www.straitstimes.com/sites/default/files/styles/x_large/public/articles/2020/02/20/yq-cornchina020022021.jpg?itok=zIFnthJC",
        publishedAt: "2020-02-20T13:27:01Z",
        content:
          "BEIJING (REUTERS/XINHUA) - The coronavirus behaves much more like influenza than other closely related viruses, said scientists in China who studied nose and throat swabs from 18 patients, suggesting it may spread even more easily than previously believed.\r\nI… [+1864 chars]"
      },
      {
        source: {
          id: null,
          name: "Channelnewsasia.com"
        },
        author: "CNA",
        title:
          "6 SAF servicemen charged in military court over death of NSF Dave Lee - CNA",
        description:
          "SINGAPORE: Six Singapore Armed Forces (SAF) servicemen were charged in military court on Thursday (Feb 20) over the death of Corporal First Class (CFC) Dave Lee.",
        url:
          "https://www.channelnewsasia.com/news/singapore/nsf-death-dave-lee-saf-servicemen-charged-military-court-mindef-12454468",
        urlToImage:
          "https://cna-sg-res.cloudinary.com/image/upload/q_auto,f_auto/image/10194894/16x9/991/557/4e26aca86c902d031bf33596dad8dc69/uz/nsf-lee-han-xuan-dave-wake--1-.jpg",
        publishedAt: "2020-02-20T10:11:56Z",
        content:
          "SINGAPORE: Six Singapore Armed Forces (SAF) servicemen were charged in military court on Thursday (Feb 20) over the death of Corporal First Class (CFC) Dave Lee.\r\nCFC Lee died aged 19 in April 2018, after suffering heatstroke following an 8km fast march at Be… [+2274 chars]"
      }
    ]
  }
};

const mockGlobalApiArticleList = {
  data: {
    status: "ok",
    totalResults: 133350,
    articleslength: 4,
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
      },
      {
        source: {
          id: null,
          name: "Straitstimes.com"
        },
        author: "hermesauto",
        title:
          "Coronavirus is like flu, spreads more easily than thought: Study - The Straits Times",
        description: ". Read more at straitstimes.com.",
        url:
          "https://www.straitstimes.com/asia/se-asia/coronavirus-can-transmit-via-aerosol-chinese-health-authorities",
        urlToImage:
          "https://www.straitstimes.com/sites/default/files/styles/x_large/public/articles/2020/02/20/yq-cornchina020022021.jpg?itok=zIFnthJC",
        publishedAt: "2020-02-20T13:27:01Z",
        content:
          "BEIJING (REUTERS/XINHUA) - The coronavirus behaves much more like influenza than other closely related viruses, said scientists in China who studied nose and throat swabs from 18 patients, suggesting it may spread even more easily than previously believed.\r\nI… [+1864 chars]"
      },
      {
        source: {
          id: null,
          name: "Channelnewsasia.com"
        },
        author: "CNA",
        title:
          "6 SAF servicemen charged in military court over death of NSF Dave Lee - CNA",
        description:
          "SINGAPORE: Six Singapore Armed Forces (SAF) servicemen were charged in military court on Thursday (Feb 20) over the death of Corporal First Class (CFC) Dave Lee.",
        url:
          "https://www.channelnewsasia.com/news/singapore/nsf-death-dave-lee-saf-servicemen-charged-military-court-mindef-12454468",
        urlToImage:
          "https://cna-sg-res.cloudinary.com/image/upload/q_auto,f_auto/image/10194894/16x9/991/557/4e26aca86c902d031bf33596dad8dc69/uz/nsf-lee-han-xuan-dave-wake--1-.jpg",
        publishedAt: "2020-02-20T10:11:56Z",
        content:
          "SINGAPORE: Six Singapore Armed Forces (SAF) servicemen were charged in military court on Thursday (Feb 20) over the death of Corporal First Class (CFC) Dave Lee.\r\nCFC Lee died aged 19 in April 2018, after suffering heatstroke following an 8km fast march at Be… [+2274 chars]"
      }
    ]
  }
};

module.exports = {
  basicResponse,
  mockFirstUser,
  mockSecondUser,
  mockUserList,
  createThirdUser,
  mockFirstCommentinFirstArticle,
  mockQuery,
  mockDBArticleList,
  mockArticleFullMessage,
  mockUsApiArticleList,
  mockSgApiArticleList,
  mockGlobalApiArticleList
};
