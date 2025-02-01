const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  createOrder,
  getOrderDetails,
  addAddress, // Ensure correct function name
} = require('../controllers/userController');

const router = express.Router();

// User Authentication
router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser); // Log in a user

// User Profile
router.get('/profile', protect, getUserProfile); // Get user profile
router.put('/profile', protect, updateUserProfile); // Update user profile

// User Orders
router.get('/orders', protect, getUserOrders); // Get user order history
router.post('/orders', protect, createOrder); // Create a new order
router.get('/orders/:id', protect, getOrderDetails); // Get details of a specific order

// Add Address
router.post('/add-address', protect, addAddress); // Correct function call

module.exports = router;
