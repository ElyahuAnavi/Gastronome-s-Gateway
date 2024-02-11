// server.js

const { connectDB } = require('./utils/database');
const { port, databaseURL } = require('./config/vars'); // Adjust the path as needed

// Handling uncaught exceptions at the top level
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err);
  process.exit(1); // Exit process immediately
});

const app = require('./app');

connectDB(databaseURL);

// Starting the server
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
