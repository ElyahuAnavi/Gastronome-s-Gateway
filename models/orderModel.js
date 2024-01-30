// models/dishModel.js

const mongoose = require('mongoose');
const Dish = require('./dishModel');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  dishes: [
    {
      dish: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dish',
        required: [true, 'Order must contain at least one dish']

      },
      quantity: {
        type: Number,
        default: 1
      }, 
      _id: false
    }
  ],
  orderTime: {
    type: Date,
    default: Date.now
  },
  orderScheduled: {
    type: Date,
    default: function () {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now;
    },
    validate: {
      validator: function (value) {
        // Ensure that the scheduled delivery time is at btween one hour from now and to six hours;
        const oneHourLater = new Date();
        oneHourLater.setHours(oneHourLater.getHours() + 1);

        const sixHoursLater = new Date();
        sixHoursLater.setHours(sixHoursLater.getHours() + 6);

        return value >= oneHourLater && value <= sixHoursLater;
      },
      message: 'Scheduled delivery time must be at least one hour from the current time'
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // coordinates is an array of numbers
      required: function () {
        return !this.isSelfCollection;
      }
    },
    address: {
      type: String,
      required: function () {
        return !this.isSelfCollection;
      }
    }
  },
  isSelfCollection: {
    type: Boolean,
    default: false
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  isItDone: {
    type: Boolean,
    default: false
  }
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderTime: -1 });
orderSchema.index({ isItDone: 1 });

orderSchema.virtual('customer', {
  ref: 'User',
  foreignField: '_id',
  localField: 'user'
});

// Virtual populate for Dishes
orderSchema.virtual('fullDishes', {
  ref: 'Dish',
  foreignField: '_id',
  localField: 'dishes.dish'
});

orderSchema.pre('save', async function (next) {
  let totalPrice = 0;

  // Ensure dishes are populated
  await this.populate('dishes.dish');

  // Calculate total price of dishes
  for (const item of this.dishes) {
    const dishPrice = item.dish.price;
    totalPrice += dishPrice * item.quantity;
  }

  // Add 30 NIS for delivery if it's not self-collection
  if (!this.isSelfCollection) {
    totalPrice += 30;
  }

  // Set the total price of the order
  this.totalPrice = totalPrice;

  next();
});

orderSchema.pre(/^find/, function (next) {
  // 'this' refers to the query object
  this.select('-orderTime -__v');
  next();
});

orderSchema.pre(/^find/, function(next) {
  // Populate user field, excluding sensitive data
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt'
  });

  // Populate dishes with dish details
  this.populate({
    path: 'dishes.dish',
    select: '-__v'
  });

  next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
