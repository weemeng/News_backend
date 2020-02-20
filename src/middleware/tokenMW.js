const bcrypt = require("bcryptjs");
const { createJWTToken } = require("../middleware/auth");
const UserModel = require("../model/user.model");

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
    httpOnly: false
    // signed: true
  });
  next();
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
    req.user = user;
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

module.exports = {
  createLoginToken,
  createSignedCookieMiddleware,
  createSignedCookieWithToken
};
