const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pin: { type: Number, required: true },
    primary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const addressModel = mongoose.model("address", addressSchema);

module.exports = addressModel;