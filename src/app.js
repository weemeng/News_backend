require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOption = {
  credentials: true,
  // allowedHeaders: "content-type",
  origin: ["http://localhost:3000", "http://localhost:3001"]
};
app.use(cors(corsOption));
app.use(cookieParser("secret"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const middleware = (req, res, next) => {
//   console.log("reached here but cant get into user router")
//   next();
// }

const { basicResponse } = require("./utils/initdata");
const newsRouter = require("./routes/news.routes");
const userRouter = require("./routes/users.routes");

app.use("/news", newsRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).send(basicResponse);
});

app.get("/*", (req, res, next) => {
  const error = new Error("page not found");
  error.statusCode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log("BASE ERROR CATCHER");
  console.log(err);
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  } else if (err.name === "MongoError" && err.code === 11000) {
    err.statusCode = 422;
  }
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
