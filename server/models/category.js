const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    cname: { type: String, required: true },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;