const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create a new order
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if products are provided in the request
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    // Create a new order instance
    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalPrice,
    });

    // Save the order to the database
    await newOrder.save();

    // Return the response
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// @desc Get orders for the logged-in user
const getOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find orders for the logged-in user
    const orders = await Order.find({ userId: req.user.id }).populate('products.productId');

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// @desc Update order status (optional for admin use)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Ensure orderId and status are provided
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    // Find the order by its ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// @desc Remove a product from an order (optional functionality)
const removeProductFromOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    // Ensure orderId and productId are provided
    if (!orderId || !productId) {
      return res.status(400).json({ message: 'Order ID and product ID are required' });
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove the product from the order's products array
    const updatedProducts = order.products.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    order.products = updatedProducts;

    // Save the updated order
    await order.save();

    res.status(200).json({
      message: 'Product removed from order',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from order', error });
  }
};
const checkoutOrder =async (req, res) => {
    const { products, totalPrice, paymentMethod, addressIndex } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      if (user.addresses.length === 0) {
        return res.status(400).json({ message: 'No address found. Please add an address first.' });
      }
  
      const address = user.addresses[addressIndex || 0]; // Default to the first address
  
      const order = await Order.create({
        userId: req.user.id,
        products,
        totalPrice,
        paymentMethod,
        address, // Include address info in the order (optional for logs or admin view)
      });
  
      res.status(201).json({ message: 'Order placed successfully.', order });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
  };
// @desc Get order details by order ID (optional)
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Find the order by ID and populate product details
    const order = await Order.findById(orderId).populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  removeProductFromOrder,
  getOrderById,
  checkoutOrder,
};
