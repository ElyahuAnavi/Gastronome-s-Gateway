// controllers/orderControler.js

const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

exports.createOrder = catchAsync(async (req, res, next) => {
  console.log(req.body.user);
  const doc = await Order.create(req.body);
  if (doc) {
    // Fetch user data
    const user = await User.findById(req.body.User);
    if (!user) return next(new AppError('User not found', 404));

    // Send email to user after order creation
    await sendEmail({
      email: user.email,
      subject: 'Your order was successfully received',
      message: `Dear ${user.name}, your order has been successfully received.`
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getOrder = factory.getOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);

// View user's orders
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort('-orderTime');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// Restaurant owner's view of all orders
exports.getAllOrders = catchAsync(async (req, res, next) => {
  // You can add additional filters here if needed
  const filter = {};

  // Add a sort condition to prioritize unfinished orders
  const orders = await Order.find(filter).sort({ isItDone: 1, orderTime: 1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort('-orderTime');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// Confirm or cancel an order
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Fetch user data
  const user = await User.findById(doc.user);
  if (!user) return next(new AppError('User not found', 404));

  // Send email to user after order status update
  await sendEmail({
    email: user.email,
    subject: 'Your order status has been updated',
    message: `Dear ${user.name}, your order has been ${doc.isItDone ? 'successfully placed' : 'updated'}.`
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});
