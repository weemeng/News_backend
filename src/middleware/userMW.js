const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/jwt");

const setLastActive = async (req, res, next) => {
  if (req.user) {
    await UserModel.findOneAndUpdate(
      { userId: req.user.userId },
      { lastActive: new Date() },
      { runValidators: true }
    );
  }
  next();
};

const toggleCurrentlyActive = async (req, res, next) => {
  if (!req.user) {
    throw new Error("You need to Login");
  }
  const user = await UserModel.findOne({
    userId: req.user.userId
  });
  user.currentlyActive = !user.currentlyActive;
  await UserModel.findOneAndUpdate(
    { userId: req.user.userId },
    { currentlyActive: user.currentlyActive }
  );
  next();
};

const checkLoginSetUser = (req, res, next) => {
  if (req.cookies.token) {
    try {
      req.user = jwt.verify(req.cookies.token, getJWTSecret());
    } catch (err) {
      throw new Error("You Cookie Stealer!");
    }
  }
  next();
};

module.exports = { setLastActive, toggleCurrentlyActive, checkLoginSetUser };
