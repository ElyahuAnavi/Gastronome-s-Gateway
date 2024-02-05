// server.js

const dotenv = require('dotenv');
const { connectDB } = require('./utils/database');

// Handling uncaught exceptions at the top level
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err);
  process.exit(1); // Exit process immediately
});

dotenv.config({ path: './config.env' });
const app = require('./app');

connectDB(process.env.DATABASE);

// Starting the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handling unhandled promise rejections (e.g., MongoDB connection issues)
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); // Exit process after server closes
  });
});
