const request = require("supertest");
const app = require("../app");
const NewsModel = require("../model/news.model");
const {
  basicResponse,
  mockDBArticleList,
  mockUsApiArticleList,
  mockSgApiArticleList,
  mockGlobalApiArticleList
} = require("../utils/initdata");
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
jest.mock("axios");

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
    await NewsModel.create(mockDBArticleList);
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
    mockDBArticleList.map(element => {
      element.publisher.publishedAt = element.publisher.publishedAt.toISOString();
    });
    it("GET /news Articles in the database", async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve({}));
      const agent = request(app);
      const { body: articleData } = await agent.get("/news").expect(200);
      expect(articleData).toMatchObject(mockDBArticleList);
    });
    it("GET /news?q expect country=us", async () => {
      const expectedResponse = [mockDBArticleList[0], mockDBArticleList[1]];
      axios.get.mockImplementationOnce(() => Promise.resolve({}));
      const agent = request(app);
      const response = await agent.get("/news?country=us").expect(200);
      expect(response.body).toMatchObject(expectedResponse);
    });
    it("GET /news?q expect earliestDate=", async () => {
      const expectedResponse = [
        mockDBArticleList[1],
        mockDBArticleList[2],
        mockDBArticleList[3]
      ];
      axios.get.mockImplementationOnce(() => Promise.resolve({}));
      const thisdate = new Date();
      thisdate.setMonth(1);
      thisdate.setDate(1);
      const agent = request(app);
      const response = await agent
        .get(`/news?earliestDate=${thisdate.toISOString()}`)
        .expect(200);
      expect(response.body).toMatchObject(expectedResponse);
    });
    it("GET /news?q expect latestDate=", async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve({}));
      const expectedResponse = mockDBArticleList[0];
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
      const expectedResponse = mockDBArticleList[0];
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
      const expectedResponse = mockDBArticleList[0];
      const { body: actualResponse } = await signedInAgent
        .post(`/news/${expectedResponse.id}/comments`)
        .send(mockComment)
        .expect(201);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(actualResponse[actualResponse.length - 1]).toEqual(
        expect.objectContaining(mockComment)
      );
    });
    
  });
});
