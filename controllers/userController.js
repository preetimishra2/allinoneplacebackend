// Updated User Controller
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password, // Password hashing handled in the User model's pre-save middleware
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login a user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error.message); // Log for debugging
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};


// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get user's order history
// @route GET /api/users/orders
// @access Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Create a new order
// @route POST /api/users/orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    const order = new Order({
      userId: req.user.id,
      items,
      totalPrice,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get order details
// @route GET /api/users/orders/:id
// @access Private
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const addAddress = async (req, res) => {
  const { street, city, state, postalCode, country } = req.body;

  if (!street || !city || !state || !postalCode || !country) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.addresses) user.addresses = []; // Initialize addresses if undefined

    user.addresses.push({ street, city, state, postalCode, country });
    await user.save();

    res.status(200).json({ message: 'Address added successfully.', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  addAddress,
  updateUserProfile,
  getUserOrders,
  createOrder,
  getOrderDetails,
};
