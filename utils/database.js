const mongoose = require('mongoose');

exports.connectDB = async function(databaseUrl) {
  const DB = databaseUrl.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
  try {
    await mongoose.connect(DB);
    console.log('DB connection successful!');
  } catch (err) {
    console.error('DB connection failed.', err);
    process.exit(1);
  }
};
