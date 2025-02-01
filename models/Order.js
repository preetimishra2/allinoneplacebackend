const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['credit-card', 'paypal', 'cash-on-delivery'] },
    status: { type: String, default: 'Pending' }, // e.g., Pending, Delivered, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
