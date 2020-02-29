const express = require("express");
const router = express.Router();
const UserModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const { createJWTToken } = require("../middleware/auth.mw");
const { protectRoute } = require("../middleware/auth.mw");
const wrapAsync = require("../utils/wrapAsync");
const uuidv4 = require("uuid/v4");

const {
  updateUserLastActive,
} = require("../middleware/user.mw");

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


router.post(
  "/login",
  createLoginToken,
  createSignedCookieWithToken,
  sendLoggedInMessage
);

router.post(
  "/logout",
  protectRoute,
  updateUserLastActive,
  (req, res) => {
    res.clearCookie("token").send("You are now logged out!");
  }
);

router.post(
  "/newUser",
  wrapAsync(async (req, res, next) => {
    try {
      //need to add ID into the user
      const user = new UserModel(req.body);
      await UserModel.init();
      user.userId = uuidv4();
      user.userType = "user";
      await user.save();
      res.status(201).send(user.toObject());
    } catch (err) {
      next(err);
    }
  })
);

router.get(
  "/signedcookies",
  createSignedCookieMiddleware(),
  sendLoggedInMessage
);

router
  .route("/")
  .get(
    protectRoute,
    updateUserLastActive,
    wrapAsync(async (req, res) => {
      const filter = { userId: req.user.userId };
      const OwnUser = await UserModel.findOne(filter);
      res.status(200).send(OwnUser);
    })
  )
  .patch(
    protectRoute,
    updateUserLastActive,
    wrapAsync(async (req, res) => {
      const requestedUpdate = req.body;
      const update = {};
      const updateKeys = Object.keys(requestedUpdate);
      updateKeys.forEach(keyVal => {
        if (
          keyVal === "username" ||
          keyVal === "password" ||
          keyVal === "email"
        ) {
          return update[keyVal] = requestedUpdate[keyVal];
        }
      });
      const filter = { userId: req.user.userId };
      update.username = req.body.username;
      const option = { new: true, runValidators: true };
      const updateUser = await UserModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      res.status(202).send(updateUser);
    })
  );

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
