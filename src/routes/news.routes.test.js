const request = require("supertest");
const app = require("../app");
const {
  basicResponse,
  mockUser,
  mockQuery,
  mockFirstCommentinFirstArticle,
  mockFirstArticle,
  mockSecondArticle,
  mockThirdArticle,
  mockArticleList,
  mockArticleFullMessage
} = require("../utils/initdata");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const NewsModel = require("../model/news.model");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("app", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
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

  it("CHECK TEST (one should be one and not anything else)", () => {
    expect(1).toBe(1);
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
    it("GET /news?q expect country=cn", async () => {
      const expectedResponse = mockArticleList[2];
      const agent = request(app);
      const response = await agent.get("/news?country=cn").expect(200);
      // "/news?(country=|tag=|headline=|earliestDate=|latestDate="
      expect(response.body).toMatchObject([expectedResponse]);
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
    it.only("GET /news/:id/comments", async () => {
      const expectedResponse = mockArticleList[0];
      const agent = request(app);
      const response = await agent
        .get(`/news/${expectedResponse.id}/comments`)
        .expect(200);
      expect(response.body).toMatchObject(expectedResponse.comments);
    });
  });
});
