const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/jwt");

const updateUserLastActive = async (req, res, next) => {
  if (req.user) {
    await UserModel.findOneAndUpdate(
      { userId: req.user.userId },
      { lastActive: new Date() },
      { runValidators: true }
    );
  }
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

module.exports = { updateUserLastActive, checkLoginSetUser };
 