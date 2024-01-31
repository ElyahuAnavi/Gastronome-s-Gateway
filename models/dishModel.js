// models/dishModel.js

const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A dish must have a name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A dish must have a description']
  },
  price: {
    type: Number,
    required: [true, 'A dish must have a price']
  },
  inventory: {
    type: Number,
    required: [true, 'A dish must have an inventory count'],
    min: [0, 'Inventory cannot be negative']
  },
  lastOrderDate: Date,
  orderCount: {
    type: Number,
    default: 0
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
