const express = require("express");
const router = express.Router();
const UserModel = require("../model/user.model");
const {getUUID, getArticleIDMD5} = require("../utils/generateId");
const { protectRoute } = require("../middleware/auth");
const wrapAsync = require("../utils/wrapAsync");
const {
  setLastActive,
  toggleCurrentlyActive
} = require("../middleware/userMW");
const {
  createLoginToken,
  createSignedCookieMiddleware,
  createSignedCookieWithToken
} = require("../middleware/tokenMW");
const sendLoggedInMessage = (req, res) => {
  res.send("You are now logged in!");
};

router.post(
  "/login",
  createLoginToken,
  createSignedCookieWithToken,
  toggleCurrentlyActive,
  sendLoggedInMessage
);

router.post(
  "/logout",
  protectRoute,
  setLastActive,
  toggleCurrentlyActive,
  (req, res) => {
    res.clearCookie("token").send("You are now logged out!");
  }
);

router.post("/newUser", async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    await UserModel.init();
    user.userId = getUUID();
    await user.save();
    res.status(201).send(user.toObject());
  } catch (err) {
    next(err);
  }
});

router.get(
  "/signedcookies",
  createSignedCookieMiddleware(),
  sendLoggedInMessage
);

router
  .route("/")
  .get(
    protectRoute,
    setLastActive,
    wrapAsync(async (req, res) => {
      const filter = { userId: req.user.userId };
      const OwnUser = await UserModel.findOne(filter);
      res.status(200).send(OwnUser);
    })
  )
  .patch(
    protectRoute,
    setLastActive,
    wrapAsync(async (req, res) => {
      const requestedUpdate = req.body;
      const update = {};
      const updateKeys = Object.keys(requestedUpdate);
      updateKeys.forEach(keyVal =>
        keyVal === "username"
          ? (update[keyVal] = requestedUpdate[keyVal])
          : keyVal === "password"
          ? (update[keyVal] = requestedUpdate[keyVal])
          : keyVal === "email"
          ? (update[keyVal] = requestedUpdate[keyVal])
          : true
      );
      console.log(update);
      const filter = { userId: req.user.userId };
      // const update = { username: req.body.username };
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
