const UserModel = require("../model/user.model");

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

module.exports = { setLastActive, toggleCurrentlyActive };
