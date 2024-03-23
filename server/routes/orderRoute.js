const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");
const Address = require("../models/address");
const User = require("../models/user");

const pdf = require('html-pdf');
require("dotenv").config(); 
 
const stripe = require("stripe")("sk_test_51OqrVHSBdk6MSssjqkZWkcVnTNm4NjAAa3O96lRPpKSzApRnM3X2y0bK1i6iu2bocxl5OcqNy3xamoMGepz00pWC00LqHrKNnA");


router.get('/getallorders', async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();

        // Respond with the fetched orders
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/checkout', async (req, res) => {
    try {
        // Extract order details from request body
        const { userid, addressid, products, order_total, status } = req.body;

        // Create the order
        const order = new Order({
            userid,
            addressid,
            products,
            order_total,
            status
        });

        // Save the order to the database
        const savedOrder = await order.save();

        const updateProductPromises = products.map(async (product) => {
          // Find the product in the database and update its quantity
          await Product.findByIdAndUpdate(product.product, { $inc: { stock: -1 } });
      });

      // Wait for all product quantity updates to complete
      await Promise.all(updateProductPromises);
        // Respond with the saved order
        //res.status(201).json(savedOrder);
        const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
			  {
				price_data: {
				  currency: "inr",
				  product_data: {
					name: "Total Payable Amount",
				  },
				  unit_amount: Math.round(order_total * 100),
				},
				quantity: 1,
			  },
			],
			mode: "payment",
			billing_address_collection:'required',
			success_url: "http://localhost:3000/crafthub/home", // Update with your actual success URL
			cancel_url: "http://localhost:3000/cancel",
		  });
	  
		  console.log("Stripe Session ID:", session.id);
		  console.log("Stripe Session URL:", session.url);

	  
		  // Redirect the user to the Stripe checkout page
		  res.status(200).json({ success: true, data: savedOrder, stripeRedirectUrl: session.url });

		

        
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update/:orderId', async (req, res) => {
  try {
      const orderId = req.params.orderId;
      const { status } = req.body;

      // Find the order by ID and update its status
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

      if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Respond with the updated order
      res.status(200).json(updatedOrder);
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/order/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Use req.params.id instead of req.params.userId
    const orders = await Order.find({ userid: userId }); // Assuming your Order model has a field named 'userId'
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to generate and download invoice as PDF
router.get('/invoice/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const user = await User.findById(order.userid);
    const address = await Address.findById(order.addressid);
    const products = await Promise.all(order.products.map(async (item) => {
      const product = await Product.findById(item.product);
      return { ...item, product };
    }));

    // Construct HTML content for the invoice
    const invoiceHtml = `
      <h1>Invoice for Order ${order._id}</h1>
      <h2>User Details</h2>
      <p>Name: ${user.fname} ${user.lname}</p>
      <p>Email: ${user.email}</p>
      <h2>Shipping Address</h2>
      <p>${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.pin}</p>
      <h2>Products Ordered</h2>
      <ul>
    ${products.map((item) => `
      <li style="display: flex; align-items: center;">
        <div style="margin-right: 20px;">
          <img src="${item.product.image}" alt="Product Image" style="width: 100px; height: auto;" />
        </div>
        <div>
          <p>${item.product.name}</p>
          <p>Quantity: ${1}</p>
          <p>Price: ${item.product.price}</p>
        </div>
      </li>`
    ).join('')}
  </ul>
    `;

    // Generate PDF from HTML content
    pdf.create(invoiceHtml).toBuffer((err, buffer) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).json({ error: 'Error generating PDF' });
      }
      // Return the PDF file as a buffer
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice_${orderId}.pdf"`,
      });
      res.send(buffer);
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  module.exports = router;