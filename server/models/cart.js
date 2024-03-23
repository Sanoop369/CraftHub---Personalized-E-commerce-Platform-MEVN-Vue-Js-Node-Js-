const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false // Since you allow null and blank in Django
  },
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;