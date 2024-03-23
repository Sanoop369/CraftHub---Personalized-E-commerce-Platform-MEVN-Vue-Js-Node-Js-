const express = require("express");
const router = express.Router();

const Rating = require("../models/rating");

router.post("/addrating", async (req, res) => {
    try {
      const newRating = new Rating(req.body);
      const rating = await newRating.save();
  
      res.send("New ratings added successfully..!");
    } catch (error) {
      console.error('Error adding rating:', error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.get("/getrating/:productId", async (req, res) => {
    try {
      const { user } = req.body;
      const ratings = await Rating.find({ productid: req.params.productId });
      const userRating = ratings.find(rating => rating.userid === user);
    const hasRated = !!userRating; // Check if user has rated the product

    res.send({ ratings, hasRated });
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return res.status(400).json({ message: error.message });
    }
  });

  module.exports = router;