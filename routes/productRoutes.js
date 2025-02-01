const express = require('express');
const {
  getProducts,
  getProductById,
  searchProducts,
  getTopProducts,
} = require('../controllers/productController');

const router = express.Router();

// Public Product Routes
router.get('/', getProducts); // Get all products
router.get('/search', searchProducts); // Search and filter products
router.get('/top', getTopProducts); // Get top-rated products
router.get('/:id', getProductById); // Get a single product by ID

module.exports = router;
