const express = require("express");
const FavoriteRouter = express.Router();
const FavoriteModel = require("../models/FavoriteModel"); // create this model

// Add favorite news
FavoriteRouter.post("/favorites", async (req, res) => {
  try {
    const { userId, news } = req.body;
    if (!userId || !news) {
      return res
        .status(400)
        .json({ message: "User ID or news data is missing." });
    }
    const favorite = new FavoriteModel({
      userId,
      news,
    });
    await favorite.save();
    res.status(201).json(favorite); 
  } catch (err) {
    console.error("Error saving favorite:", err);
    res
      .status(500)
      .json({ message: "Failed to save favorite. Please try again." });
  }
});


// Get favorite news for a user
FavoriteRouter.get("/favorites/:userId", async (req, res) => {
  try {
    const favorites = await FavoriteModel.find({ userId: req.params.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete a favorite by its ID
FavoriteRouter.delete("/favorites/:id", async (req, res) => {
  try {
    await FavoriteModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = FavoriteRouter;
