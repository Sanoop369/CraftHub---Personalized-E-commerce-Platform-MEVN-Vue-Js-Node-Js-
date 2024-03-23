const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
  
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    
   
      description: { type: String, required: true },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;