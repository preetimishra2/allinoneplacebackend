const mongoose = require('mongoose');
require('colors'); // Import colors

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold); // Now works after importing colors
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
