const express = require('express');
const { 
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts, // Added this function
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  uploadImage,
} = require('../controllers/adminController');

const router = express.Router();

// Define your routes
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products', getAllProducts); // Route for fetching all products
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.post('/upload', uploadImage);

module.exports = router;
