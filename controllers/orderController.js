// controllers/orderControler.js

const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

exports.createOrder = catchAsync(async (req, res, next) => {
  // Create the order
  const newOrder = await Order.create({
    ...req.body,
    user: req.user._id
  });

  // Fetch user data
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Send email to user
  await sendEmail({
    email: user.email,
    subject: 'Your order was successfully received',
    message: `Dear ${user.name}, your order has been successfully received.`
  });

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder
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
    message: `Dear ${user.name}, your order has been ${
      doc.isItDone ? 'successfully placed' : 'updated'
    }.`
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getTopProfitableCustomers = catchAsync(async (req, res, next) => {
  try {
    // Ensure the aggregate pipeline matches your database documents' structure.
    const topCustomers = await Order.aggregate([
      {
        $match: { isItDone: true }
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users', // Double-check this is the correct collection name
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          totalSpent: 1,
          'userDetails.name': 1,
          'userDetails.email': 1
        }
      }
    ]);

    if (topCustomers.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No top customers found.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        topCustomers
      }
    });
  } catch (err) {
    next(err);
  }
});

exports.getMostProfitableDayLastMonth = catchAsync(async (req, res, next) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const result = await Order.aggregate([
    {
      $match: {
        orderTime: { $gte: oneMonthAgo },
        isItDone: true, // Assuming you only want to consider completed orders
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$orderTime" }
        },
        totalIncome: { $sum: "$totalPrice" },
        ordersCount: { $sum: 1 }
      }
    },
    {
      $sort: { totalIncome: -1 }
    },
    { $limit: 1 }
  ]);

  if (result.length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'No data found for the last month.'
    });
  }

  res.status(200).json({
    status: 'success',
    data: result[0]
  });
});


