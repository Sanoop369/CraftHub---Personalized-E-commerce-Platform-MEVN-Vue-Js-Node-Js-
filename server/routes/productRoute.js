const express = require("express");
const router = express.Router();

const Product = require("../models/product");

// router.post("/addproduct", async (req, res) => {
//   try {
//     const newProduct = new Product(req.body);
//     const product = await newProduct.save();

//     res.send("New product added successfully..!");
//   } catch (error) {
//     console.error('Error adding product:', error);
//     return res.status(400).json({ message: error.message });
//   }
// });

router.post("/addproduct", async (req, res) => {
  try {
    const { name, description, file, categoryid, price, stock, isCheckbox } = req.body;

        // Decode the base64 file data
        const decodedFile = Buffer.from(file, 'base64');

        // Create a new product document
        const product = new Product({
            name,
            description,
            file: decodedFile,
            image:file.toString('base64'),
            categoryid,
            price,
            stock,
            isCheckbox
        });

        // Save the product to the database
        await product.save();

    res.send("New product added successfully..!");
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(400).json({ message: error.message });
  }
});
router.get("/getallproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to delete product" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update product" });
  }
});

module.exports = router;
