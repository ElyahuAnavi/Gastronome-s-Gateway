// utils/database.js

const mongoose = require('mongoose');
exports.connectDB = async function(databaseURL) {
  try {
    await mongoose.connect(databaseURL);
    console.log('DB connection successful!');
  } catch (err) {
    console.error('DB connection failed.', err);
    process.exit(1);
  }
};
