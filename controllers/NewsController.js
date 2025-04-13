const axios = require("axios");
const NewsRouter = require("express").Router();
require("dotenv").config();

NewsRouter.get("/news", async (req, res) => {
  const { category = "general", page = 1, pageSize = 8 } = req.query;

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`
    );

    const articles = response.data.articles || [];

    res.status(200).json({
      articles,
      totalResults: response.data.totalResults,
      currentPage: Number(page),
      totalPages: Math.ceil(response.data.totalResults / pageSize),
    });
  } catch (error) {
    console.error("Error Fetching News:", error.message);
    res.status(500).json({
      error: "Failed to fetch news.",
    });
  }
});

module.exports = NewsRouter;
