const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
   
    description: { type: String, required: true },
    file: { type: Buffer, required: true },
    image:{ type: String, required: true },
  
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    
    price: { type: Number, required: true, },
    stock: { type: Number, required: true, },
    isCheckbox: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;