const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const multer = require('multer');
const path = require('path');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to "uploads/" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allow only image files
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
}).single('image');

// @desc Upload an image
// @route POST /api/admin/upload
// @access Admin
const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl });
  });
};




// @desc Create a new product
// @route POST /api/admin/products
// @access Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, stock } = req.body;
    const product = new Product({ name, description, price, images, category, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update a product
// @route PUT /api/admin/products/:id
// @access Admin
// Update product with images
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc Delete a product
// @route DELETE /api/admin/products/:id
// @access Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all users
// @route GET /api/admin/users
// @access Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a user
// @route DELETE /api/admin/users/:id
// @access Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all orders
// @route GET /api/admin/orders
// @access Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status
// @route PUT /api/admin/orders/:id
// @access Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.json(products); // Respond with the list of products
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Existing exports
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  uploadImage, 
  getAllProducts,
};