// services/orderService.js

const DataAccess = require('../utils/dataAccess');
const sendEmail = require('../utils/email');
const { executeQueryWithFeatures } = require('../controllers/helperController');

const orderModel = 'Order';
const userModel = 'User';

exports.createOrder = async (orderData, userId) => {
  const newOrder = await DataAccess.create(orderModel, {
    ...orderData,
    user: userId
  });
  const user = await DataAccess.findById(userModel, userId);

  if (!user) {
    throw new Error('User not found');
  }

  await sendEmail({
    email: user.email,
    subject: 'Your order was successfully received',
    message: `Dear ${user.name}, your order has been successfully received.`
  });

  return newOrder;
};

exports.getOrdersByUser = async userId => {
  return await executeQueryWithFeatures(orderModel, { user: userId }, {});
};

exports.getAllOrders = async queryParams => {
  return await executeQueryWithFeatures(orderModel, {}, queryParams);
};

exports.getOrderById = async userId => {
  const orders = await DataAccess.getModel(orderModel)
    .find({ user: userId })
    .sort('-orderTime');
  return orders;
};

exports.updateOrderStatus = async (orderId, userId, updateFields) => {
  const updatedOrder = await DataAccess.updateById(
    orderModel,
    orderId,
    updateFields
  );
  ensureFound(updatedOrder, 'No order found with that ID');

  const user = await DataAccess.findById('User', userId);
  ensureFound(user, 'User not found');

  await sendEmail({
    email: user.email,
    subject: 'Your order status has been updated',
    message: `Dear ${user.name}, your order has been ${
      updatedOrder.isDone ? 'successfully completed' : 'updated'
    }.`
  });

  return updatedOrder;
};
exports.getTopProfitableCustomers = async () => {
  const pipeline = [
    { $match: { isItDone: true } },
    { $group: { _id: '$user', totalSpent: { $sum: '$totalPrice' } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    { $unwind: '$userDetails' },
    {
      $project: { totalSpent: 1, 'userDetails.name': 1, 'userDetails.email': 1 }
    }
  ];

  return DataAccess.aggregate(orderModel, pipeline);
};

exports.getMostProfitableDayLastMonth = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const pipeline = [
    {
      $match: {
        orderTime: { $gte: oneMonthAgo },
        isItDone: true
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderTime' } },
        totalIncome: { $sum: '$totalPrice' },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { totalIncome: -1 } },
    { $limit: 1 }
  ];

  const result = await DataAccess.aggregate(orderModel, pipeline);

  if (result.length === 0) {
    return {
      status: 'not_found',
      message: 'No data found for the last month.'
    };
  }

  return { status: 'success', data: result[0] };
};
