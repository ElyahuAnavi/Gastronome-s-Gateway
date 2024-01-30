const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Dish = require('./../../models/dishModel');
const User = require('./../../models/userModel');
const Order = require('./../../models/orderModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const dishes = JSON.parse(fs.readFileSync(`${__dirname}/dishes.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'));

// IMPORT DATA INTO DB --> node .\dev-data\data\import-dev-data.js --import
const importData = async () => {
  try {
    await Dish.create(dishes);
    await User.create(users, { validateBeforeSave: false });
    await Order.create(orders);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB --> node .\dev-data\data\import-dev-data.js --delete
const deleteData = async () => {
  try {
    await Order.deleteMany();
    await Dish.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
