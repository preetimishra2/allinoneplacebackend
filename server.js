const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes'); 
const productRoutes = require('./routes/productRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON payloads
app.use(cors()); // Enable CORS for all routes

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static file serving for uploads with CORS
const uploadsPath = path.join(__dirname, '/uploads');
app.use(
  '/uploads',
  cors({
    origin: '*', // Allow all origins or specify 'http://localhost:3000'
    methods: ['GET', 'HEAD'], // Allow only safe methods for static files
  }),
  express.static(uploadsPath)
);

// Debugging: Log the resolved file path and requests to the uploads folder
app.use('/uploads', (req, res, next) => {
  console.log('Static file requested:', req.url);
  console.log('Resolved path:', path.resolve(uploadsPath, req.url));
  next();
});

// API Routes
app.use('/api/admin', adminRoutes); // Register admin routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '/frontend/build');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendPath, 'index.html'))
  );
}

// Custom error handling middleware
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle other server errors

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);
