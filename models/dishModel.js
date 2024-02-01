// models/dishModel.js

const mongoose = require('mongoose');
const slugify = require('slugify');

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
    // required: [true, 'A dish must have a cover image']
  },
  images: [String]
});

// Define a pre-save hook for the dishSchema
dishSchema.pre('save', function(next) {
  // Generate a slug from the dish name
  // The slug is a URL-friendly version of the dish name,
  // converted to lowercase using the 'slugify' function.
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
