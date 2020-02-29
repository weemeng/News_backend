const request = require("supertest");
const app = require("../app");
const UserModel = require("../model/user.model");
const { mockUserList, mockFirstUser } = require("../utils/initdata");
const {
  mongooseBeforeAll,
  mongooseTearDown
} = require("../utils/mongooseTest");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

describe("user", () => {
  let mongoServer;
  let signedInAgent;
  beforeAll(async () => {
    mongoServer = await mongooseBeforeAll();
  });
  afterAll(async () => {
    await mongooseTearDown(mongoServer);
  });
  beforeEach(async () => {
    await UserModel.create(mockUserList);
  });
  afterEach(async () => {
    await UserModel.deleteMany();
  });
  it("POST /user/newUser add one user", async () => {
    const newUser = {
      username: `MaryJ`,
      userType: `user`,
      password: `123456789`,
      email: `mjuser.email.com`,
      commentActivity: {},
      browseActivity: {}
    };
    const agent = request(app);
    const response = await agent
      .post("/user/newUser")
      .send(newUser)
      .expect(201);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.password).not.toBe(newUser.password);
  });

  it("POST /login should login when password is correct", async () => {
    const loginUser = {
      username: `JJJameson`,
      password: "asdfghjkl"
    };
    signedInAgent = request(app);
    const { text: message } = await signedInAgent
      .post("/user/login")
      .send(loginUser)
      .expect(200);
    // console.log(response.text)
    expect(message).toEqual("You are now logged in!");
  });
  it("POST /user/login should not login when password is incorrect", async () => {
    const wrongUser = {
      username: `JJJameson`,
      password: "asdfghjkl1"
    };
    const agent = request(app);
    const { body: errorMessage } = await agent
      .post(`/user/login`)
      .send(wrongUser)
      .expect(400);
    expect(errorMessage.error).toEqual("Login failed");
  });
  it("GET /user should respond with user data of user that is logged in", async () => {
    const expectedUser = {
      userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
      username: `JJJameson`,
      userType: `admin`,
      email: `jjadmin.email.com`
    };
    jwt.verify.mockReturnValueOnce({ userId: expectedUser.userId });
    signedInAgent = request(app);
    const { body: actualUser } = await signedInAgent
      .get(`/user`)
      .set("Cookie", "token=valid-token")
      .expect(200);
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(actualUser).toMatchObject(expectedUser);
  });
  it("Patch /user should respond with updated user data provided user is logged in", async () => {
    const expectedUser = {
      userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
      username: `JJJameson`,
      userType: `admin`,
      email: `jjadmin.email.com`
    };
    const changeUsername = {
      username: "Brock",
      password: "1239891237"
    };
    jwt.verify.mockReturnValueOnce({ userId: expectedUser.userId });
    signedInAgent = request(app);
    const { body: actualUser } = await signedInAgent
      .patch(`/user`)
      .send(changeUsername)
      .set("Cookie", "token=valid-token")
      .expect(202); //202 accepted
    expect(jwt.verify).toHaveBeenCalled();
    expect(actualUser).toHaveProperty("username", "Brock");
  });
});
