const express = require("express");
const app = express();
const { basicResponse } = require("./utils/initdata");

const newsRouter = require("./routes/news.routes");

app.use(express.json());
app.use("/news", newsRouter);

app.get("/", (req, res) => {
  res.status(200).send(basicResponse);
});

app.use((err, req, res, next) => {
  console.log("BASE ERROR CATCHER");
  console.log(err.message)
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
