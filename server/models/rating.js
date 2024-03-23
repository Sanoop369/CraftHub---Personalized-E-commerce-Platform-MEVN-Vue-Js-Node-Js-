const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
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
    username: { type: String, required: true },
    
   
      rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const ratingModel = mongoose.model("ratings", ratingSchema);

module.exports = ratingModel;