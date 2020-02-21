const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/jwt");

const protectRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You are not authorized");
    }
    req.user = jwt.verify(req.cookies.token, getJWTSecret());
    next();
  } catch (err) {
    console.log(err);
    err.statusCode = 401;
    next(err);
  }
};

const createJWTToken = (myId, myUserName) => {
  const today = new Date();
  const exp = new Date(today);

  const secret = getJWTSecret();
  exp.setDate(today.getDate() + 60);

  const payload = {
    userId: myId,
    username: myUserName,
    exp: parseInt(exp.getTime() / 1000),
  };
  const token = jwt.sign(payload, secret);
  return token;
};

module.exports = { protectRoute, createJWTToken };
