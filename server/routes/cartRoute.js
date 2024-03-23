const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const CartProduct = require("../models/cartproduct");
const Product = require("../models/product");



const app = express();





router.post('/add-to-cart/:id', async (req, res) => {
  try {
      const { user, cartId } = req.body;
      const productId = req.params.id;

      console.log("cart id from vue", cartId)
      const product = await Product.findById(productId);
      let cart = null;

      // Check if the cart exists
      if (cartId) {
          cart = await Cart.findById(cartId);
      }
      console.log(cart)

      // If cart does not exist, create a new one
      if (!cart) {
          cart = await Cart.create({ customer: user, total: 0 });
          console.log("newly created cart", cart)
      }

      // Create a new cart product for the added product
      const cartProduct = await CartProduct.create({
          cart: cart._id,
          product: product._id,
          rate: product.price,
          quantity: 1,
          subtotal: product.price
      });
      console.log("new cart product", cartProduct)

      // Update cart total and save changes
      cart.total += product.price;
      await Promise.all([cart.save(), cartProduct.save()]);

      res.json({ success: true, cart, message: 'Product added to cart successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



router.post('/items', async (req, res) => {
  try {
    const {  user,cartId } = req.body;
    console.log("cart id",cartId)
    console.log("user",user)

    // Fetch cart product items associated with the specified cart ID
    
    const cartItems = await CartProduct.find({ cart: cartId }).populate('product');
    console.log("cart items",cartItems)

    // Send the fetched cart items as a response
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find the cart product by its ID
    const cartProduct = await CartProduct.findById(itemId);
    if (!cartProduct) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Remove the cart product from the database
    await cartProduct.remove();

    // Retrieve the corresponding cart object
    const cart = await Cart.findById(cartProduct.cart);

    // Recalculate the total based on the updated cart items
    const cartItems = await CartProduct.find({ cart: cart._id });
    cart.total = cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the updated cart total
    await cart.save();

    res.json({ success: true, message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




router.get('/manage/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const action = req.query.action;
      console.log("id",id)
      console.log("action",action)

      // Find the cart product by id
      const cartProduct = await CartProduct.findById(id);
      if (!cartProduct) {
          return res.status(404).json({ success: false, message: 'Cart item not found' });
      }

      // Update cart product based on action
      switch (action) {
          case 'inc':
              cartProduct.quantity++;
              cartProduct.subtotal += cartProduct.rate;
              break;
          case 'dcr':
              if (cartProduct.quantity > 1) {
                  cartProduct.quantity--;
                  cartProduct.subtotal -= cartProduct.rate;
              } else {
                  // If quantity is already 1, you may choose to remove the item
                  await cartProduct.remove();
                  return res.json({ success: true, message: 'Cart item removed successfully' });
              }
              break;
          case 'rmv':
              await cartProduct.remove();
              console.log("cart item removerd")
              res.json({ success: true, message: 'Cart item removed successfully' });
              break;
          default:
              return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      // Save the updated cart product
      await cartProduct.save();

      // Find the corresponding cart object
      const cart = await Cart.findById(cartProduct.cart);

      // Recalculate the total based on the updated cart items
      const cartItems = await CartProduct.find({ cart: cart._id });
      cart.total = cartItems.reduce((total, item) => total + item.subtotal, 0);

      // Save the updated cart total
      await cart.save();

      res.json({ success: true, message: 'Cart item(s) updated successfully' });
  } catch (error) {
      console.error('Error managing cart item:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/empty/:cartId', async (req, res) => {
  try {
      const cartId = req.params.cartId;

      // Find the cart object by ID
      const cart = await Cart.findById(cartId);
      if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      // Remove all cart items associated with the specified cart ID
      await CartProduct.deleteMany({ cart: cartId });

      // Delete the cart object itself
      await cart.remove();

      res.json({ success: true, message: 'Cart emptied successfully' });
  } catch (error) {
      console.error('Error emptying cart:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;
