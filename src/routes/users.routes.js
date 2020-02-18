const express = require("express");
const router = express.Router();
const UserModel = require("../model/user.model");
const generateId = require("../../generateId");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/jwt");
const { protectRoute } = require("../middleware/auth");
const wrapAsync = require("../utils/wrapAsync");

const createJWTToken = (myId, myUserName) => {
  const today = new Date();
  const exp = new Date(today);

  const secret = getJWTSecret();
  exp.setDate(today.getDate() + 60);

  const payload = {
    id: myId,
    userName: myUserName,
    exp: parseInt(exp.getTime() / 1000)
  };
  const token = jwt.sign(payload, secret);
  return token;
};

const createSignedCookieWithToken = (req, res, next) => {
  createSignedCookieMiddleware(req.token)(req, res, next);
};
const createSignedCookieMiddleware = content => (req, res, next) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = oneDay * 7;
  const expiryDate = new Date(Date.now() + oneWeek);
  res.cookie("token", content, {
    expires: expiryDate,
    secure: false,
    sameSite: "none",
    signed: true
  });
  next();
};
const sendLoggedInMessage = (req, res) => {
  res.send("You are now logged in!");
};

const createLoginToken = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error("Login failed");
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new Error("Login failed");
    }
    const token = createJWTToken(user.userId, user.username);
    req.token = token;
    next();
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
};

router.post(
  "/login",
  createLoginToken,
  createSignedCookieWithToken,
  sendLoggedInMessage
);
router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.post("/newUser", async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    await UserModel.init();
    user.userId = generateId();
    await user.save();
    res.status(201).send(user.toObject());
  } catch (err) {
    next(err);
  }
});
router.get(
  "/",
  protectRoute,
  wrapAsync(async (req, res) => {
    const filter = { userId: req.user.userId };
    const OwnUser = await UserModel.findOne(filter);
    res.status(200).send(OwnUser);
  })
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
