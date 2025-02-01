// orderRoutes.js
const express = require('express');
const { createOrder, getOrders, updateOrderStatus , checkoutOrder} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply the 'protect' middleware here
router.post('/cart', protect, (req, res) => {
  // Your cart logic goes here
});

// Create a new order
router.post('/', protect, createOrder);  // Use 'protect' middleware here

// Get orders for the logged-in user
router.get('/', protect, getOrders);  // Use 'protect' middleware here

// Update order status (optional)
router.patch('/status', protect, updateOrderStatus);

router.post('/checkout', protect, checkoutOrder);
  
module.exports = router;
