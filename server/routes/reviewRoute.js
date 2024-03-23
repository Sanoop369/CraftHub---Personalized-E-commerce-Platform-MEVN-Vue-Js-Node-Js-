const express = require("express");
const router = express.Router();

const Review = require("../models/review");

router.post("/addreview", async (req, res) => {
    try {
      const newReview = new Review(req.body);
      const review = await newReview.save();
  
      res.send("New review added successfully..!");
    } catch (error) {
      console.error('Error adding review:', error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.get("/getreview/:productId", async (req, res) => {
    try {
      const reviews = await Review.find({ productid: req.params.productId });
      res.send(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(400).json({ message: error.message });
    }
  });

  module.exports = router;
