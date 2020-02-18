const request = require("supertest");
const app = require("../app");
const { basicResponse, mockArticleList } = require("../utils/initdata");
const {
  mongooseBeforeAll,
  mongooseTearDown
} = require("../utils/mongooseTest");
const mongoose = require("mongoose");
const NewsModel = require("../model/news.model");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("app", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await mongooseBeforeAll();
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

  it.only("CHECK TEST (one should be one and not anything else)", () => {
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
      const expectedResponse = mockArticleList[0];
      const agent = request(app);
      const { body: actualResponse } = await agent
        .post(`/news/${expectedResponse.id}/comments`)
        .send(mockComment)
        .expect(201);
      expect(actualResponse[actualResponse.length - 1]).toEqual(
        expect.objectContaining(mockComment)
      );
    });
  });
});
