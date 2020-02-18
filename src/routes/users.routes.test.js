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
  it("should return 1 when 1", () => {
    expect(1).toBe(1);
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

  it.only("POST /login should login when password is correct", async () => {
    const loginUser = {
      username: `JJJameson`,
      password: "asdfghjkl"
    };
    const agent = request(app)
    const response = await agent
      .post("/user/login")
      .send(loginUser)
      .expect(200);
    // console.log(response.text)
    expect(response.text).toEqual("You are now logged in!");
  });
  // it("GET /user should respond with user data of user that is logged in", async () => {
  // const expectedUser = {
  //   userId: `bf6aa598-c9aa-40aa-a3a4-0984c2f1df80`,
  //   username: `JJJameson`,
  //   userType: `admin`,
  //   email: `jjadmin.email.com`,
  //   currentlyActive: true
  // };
  //   jwt.verify.mockReturnValueOnce({ username: expectedUser.username });
  //   const {body: actualUser} = await signedInAgent.get(`/user`).expect(200);
  //   expect(jwt.verify).toHaveBeenCalledTimes(1);
  //   expect(actualUser).toEqual(expectedUser);
  // });
});
