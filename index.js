const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectionDb } = require("./db");
const AuthRouter = require("./controllers/AuthController");
const NewsRouter = require("./controllers/NewsController"); 
const SubscriberRouter = require("./controllers/SubscriberController");
const FavoriteRouter = require("./controllers/FavoriteNews");

const app = express();
app.use(express.json());
app.use(cors());


connectionDb();

app.use("/api/auth", AuthRouter);
app.use("/api", NewsRouter); 
app.use("/alert", SubscriberRouter);
app.use("/api",FavoriteRouter)

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
  console.log(
    `Server is running at http://${process.env.HOST_NAME}:${process.env.PORT}`
  );
});