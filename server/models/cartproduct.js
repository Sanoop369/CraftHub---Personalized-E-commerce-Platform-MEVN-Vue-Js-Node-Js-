const mongoose = require("mongoose");
const cartProductSchema = mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  image:{ type: String},
  text:{ type: String},
  file:{type:String}
}, { timestamps: true });

const CartProduct = mongoose.model("CartProduct", cartProductSchema);

module.exports = CartProduct;
