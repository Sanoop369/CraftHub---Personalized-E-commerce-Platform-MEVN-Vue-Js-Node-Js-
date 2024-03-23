const express = require("express");
const router = express.Router();

const Category = require("../models/category");

router.post("/addcategory", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const category = await newCategory.save();

    res.send("New category added successfully..!");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});



router.get("/getallcategories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.findByIdAndRemove(categoryId);

    res.send("Category removed successfully..!");
  } catch (error) {
    console.error('Error removing category:', error);
    return res.status(400).json({ message: error });
  }
});

// Update a category
router.put("/update/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = req.body;
    await Category.findByIdAndUpdate(categoryId, updatedCategory);

    res.send("Category updated successfully..!");
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
