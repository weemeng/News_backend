const request = require("supertest");
const app = require("../app");
const NewsModel = require("../model/news.model");
const { basicResponse, mockArticleList } = require("../utils/initdata");
const {
  mongooseBeforeAll,
  mongooseTearDown
} = require("../utils/mongooseTest");
const mongoose = require("mongoose");
const axios = require("axios");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");
// jest.mock("axios");

describe("app", () => {
  let mongoServer;
  let signedInAgent;
  beforeAll(async () => {
    mongoServer = await mongooseBeforeAll();
    signedInAgent = request.agent(app);
    await signedInAgent.get("/user/signedcookies").expect(200);
  });
  afterAll(async () => {
    await mongooseTearDown(mongoServer);
  });
  beforeEach(async () => {
    await NewsModel.create(mockArticleList);
    jest.spyOn(console, "error");
    console.error.mockReturnValue({});
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await NewsModel.deleteMany();
  });

  it("GET / return all path links", async () => {
    const agent = request(app);
    const response = await agent.get("/").expect(200);
    expect(response.body).toMatchObject(basicResponse);
  });

  describe("/news", () => {
    mockArticleList.map(element => {
      element.publisher.publishedAt = element.publisher.publishedAt.toISOString();
    });
    it("GET /news Articles in the database", async () => {
      const agent = request(app);
      const { body: articleData } = await agent.get("/news").expect(200);
      expect(articleData).toMatchObject(mockArticleList);
    });
    it.only("GET /news?q expect country=us", async () => {
      const expectedResponse = [mockArticleList[0], mockArticleList[1]];
      // const expectedResponse = {
      //   status: "ok",
      //   totalResults: 38,
      //   articles: [
      //     {
      //       source: {
      //         id: "cnn",
      //         name: "CNN"
      //       },
      //       author: "Maeve Reston, CNN",
      //       title:
      //         "Democrats pile on Michael Bloomberg in his first presidential debate - CNN",
      //       description:
      //         "Michael Bloomberg came under fierce attack from Sens. Elizabeth Warren and Bernie Sanders within the first few minutes Wednesday's Democratic debate, taking hits on the exorbitant amount of money he has spent in the presidential race and the misogynistic comm…",
      //       url:
      //         "https://www.cnn.com/2020/02/19/politics/2020-primary-debate-las-vegas/index.html",
      //       urlToImage:
      //         "https://cdn.cnn.com/cnnnext/dam/assets/200219124719-03-bernie-sanders-nevada-0215-super-tease.jpg",
      //       publishedAt: "2020-02-20T02:36:00Z",
      //       content:
      //         "(CNN)Michael Bloomberg came under fierce attack from Sens. Elizabeth Warren and Bernie Sanders within the first few minutes Wednesday's Democratic debate, taking hits on the exorbitant amount of money he has spent in the presidential race and the misogynistic… [+5104 chars]"
      //     },
      //     {
      //       source: {
      //         id: null,
      //         name: "Variety.com"
      //       },
      //       author: "Michael Schneider, Michael Schneider",
      //       title:
      //         "‘The Masked Singer’ Reveals the Identity of Elephant: Here’s The Star Under the Mask - Variety",
      //       description:
      //         "SPOILER ALERT: Do not read ahead if you have not watched Season 3, episode 4 of “The Masked Singer,” which aired Feb. 19 on Fox. That’s a wipe out for Tony Hawk. The skateboarding legend beca…",
      //       url:
      //         "https://variety.com/2020/tv/news/masked-singer-season-3-episode-4-recap-elephant-unmasked-1203508557/",
      //       urlToImage:
      //         "https://pmcvariety.files.wordpress.com/2020/02/ms-s3_ep304-gg_0399-e1582156235523.jpg?w=700&h=393&crop=1",
      //       publishedAt: "2020-02-20T02:00:00Z",
      //       content:
      //         "SPOILER ALERT: Do not read ahead if you have not watched Season 3, episode 4 of “The Masked Singer,” which aired Feb. 19 on Fox. That’s a wipe out for Tony Hawk. The skateboarding legend became the first celebrity in “Group B” to be unmasked on Season 3 of “… [+5817 chars]"
      //     },
      //     {
      //       source: {
      //         id: null,
      //         name: "Cheatsheet.com"
      //       },
      //       author: "Aramide Tinubu",
      //       title:
      //         "Kim Kardashian Taking a Selfie While Kanye West Eats KFC Is the Best Thing on the Internet - Showbiz Cheat Sheet",
      //       description:
      //         "Kim Kardashian and Kanye West love showing us their wealthy antics. However, their KFC selfie might be the best thing they've ever done.",
      //       url:
      //         "https://www.cheatsheet.com/entertainment/kim-kardashian-kanye-west-kfc-selfie.html/",
      //       urlToImage:
      //         "https://www.cheatsheet.com/wp-content/uploads/2019/05/scs-icon.png",
      //       publishedAt: "2020-02-20T01:57:37Z",
      //       content:
      //         "If there is one thing we’ve learned about Kim Kardashian and Kanye West’s marriage and relationship, it’s that opposites attract. When the reality queen and rapper began dating romantically in 2012, many of us were taken aback. After all, it appeared that the… [+2789 chars]"
      //     },
      //     {
      //       source: {
      //         id: null,
      //         name: "Espn.com"
      //       },
      //       author: null,
      //       title:
      //         "More playoff teams expected under new NFL CBA, sources say - ESPN",
      //       description:
      //         "If and when a new collective bargaining agreement is finalized, it it is expected to change the NFL's playoff structure as it is currently constituted for next season, league sources told ESPN, including a move to seven teams from each conference.",
      //       url:
      //         "https://www.espn.com/nfl/story/_/id/28739375/more-playoff-teams-expected-new-nfl-cba-sources-say",
      //       urlToImage:
      //         "https://a3.espncdn.com/combiner/i?img=%2Fphoto%2F2016%2F0115%2Fr44208_1296x729_16%2D9.jpg",
      //       publishedAt: "2020-02-20T00:07:34Z",
      //       content:
      //         "If and when a new collective bargaining agreement is finalized -- and there is now mounting optimism it could be done sometime in the next week -- it is expected to include a transformational change to the NFL's playoff structure as it is currently constitute… [+1694 chars]"
      //     },
      //     {
      //       source: {
      //         id: null,
      //         name: "9to5google.com"
      //       },
      //       author: null,
      //       title:
      //         "Android 11 DP1’s Pixel Launcher preps ‘smart hotseat,’ Back Gesture tutorial - 9to5Google",
      //       description:
      //         "With the first Android 11 Developer Preview, the Google Pixel Launcher has been updated with references to a smart hotseat of app shortcuts and more.",
      //       url:
      //         "https://9to5google.com/2020/02/19/android-11-dp1-pixel-launcher-smart-hotseat/",
      //       urlToImage:
      //         "https://9to5google.com/wp-content/uploads/sites/4/2019/09/pixel_launcher_notfication_gesture_1.jpg?resize=1024,512",
      //       publishedAt: "2020-02-20T00:04:00Z",
      //       content:
      //         "The first Android 11 Developer Preview arrived for our Pixels today, bringing a variety of updates, and preparing for things to come in the later betas. In an example of the latter, the Google Pixel Launcher has been updated with references to a smart hotseat… [+3569 chars]"
      //     }
      //   ]
      // };
      // axios.get.mockImplementationOnce(() => Promise.resolve(expectedResponse));
      // axios.get = jest.fn();
      // axios.get.mockResolvedValue(expectedResponse);
      const agent = request(app);
      const response = await agent.get("/news?country=us").expect(200);
      // "/news?(country=|tag=|headline=|earliestDate=|latestDate="
      expect(response.body).toMatchObject(expectedResponse);
    });
    it("GET /news?q expect earliestDate=", async () => {
      const expectedResponse = [mockArticleList[0], mockArticleList[1]];
      const thisdate = new Date();
      thisdate.setMonth(1);
      thisdate.setDate(1);
      const agent = request(app);
      const response = await agent
        .get(`/news?earliestDate=${thisdate.toISOString()}`)
        .expect(200);
      // "/news?(country=|tag=|headline=|earliestDate=|latestDate="
      expect(response.body).toMatchObject(expectedResponse);
    });
    it("GET /news?q expect latestDate=", async () => {
      const expectedResponse = mockArticleList[2];
      const thisdate = new Date();
      thisdate.setMonth(1);
      thisdate.setDate(1);
      const agent = request(app);
      const response = await agent
        .get(`/news?latestDate=${thisdate.toISOString()}`)
        .expect(200);
      // "/news?(country=|tag=|headline=|earliestDate=|latestDate="
      expect(response.body).toMatchObject([expectedResponse]);
    });
    it("GET /news/:id/comments", async () => {
      const expectedResponse = mockArticleList[0];
      const agent = request(app);
      const response = await agent
        .get(`/news/${expectedResponse.id}/comments`)
        .expect(200);
      expect(response.body).toMatchObject(expectedResponse.comments);
    });
    it("POST /news/:id/comments", async () => {
      const mockComment = {
        userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
        title: "Im done reading this",
        comment: `This is a comment`
      };
      jwt.verify.mockReturnValueOnce({ userId: mockComment.userId });
      const expectedResponse = mockArticleList[0];
      const { body: actualResponse } = await signedInAgent
        .post(`/news/${expectedResponse.id}/comments`)
        .send(mockComment)
        .expect(201);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(actualResponse[actualResponse.length - 1]).toEqual(
        expect.objectContaining(mockComment)
      );
    });
    it("GET /news/updateNews should return News Updated with query", async () => {
      const agent = request(app);
      const response = await agent.get("/news/updateNews").expect(200);
      expect(response.body).toEqual("News Updated");
    });
  });
});
