const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    addressid: { type: mongoose.Schema.Types.ObjectId, ref: 'addresses' }, // Reference to the user who placed the order
    products: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // Reference to the ordered product
        quantity: { type: Number, required: true }, // Quantity of the ordered product
        subtotal: { type: Number, required: true }, // Subtotal for the ordered product
        image:{ type: String},
        text:{ type: String},
    }],
    order_total: { type: Number, required: true }, // Total order amount
    status: { 
        type: String, 
        enum: ['New', 'Accepted', 'Completed', 'Cancelled'], 
        default: 'Order Received' 
    }, // Status of the order
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;