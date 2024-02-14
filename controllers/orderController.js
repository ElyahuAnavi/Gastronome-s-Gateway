// controllers/orderControler.js

const catchAsync = require('../utils/catchAsync');
const { getOne, updateOne, deleteOne} = require('./handlerFactory');
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getTopProfitableCustomers,
  getMostProfitableDayLastMonth
} = require('../services/orderService');

const orderModel = 'Order';

exports.getOrder = getOne(orderModel);
exports.updateOrder = updateOne(orderModel);
exports.deleteOrder = deleteOne(orderModel);

exports.createOrder = catchAsync(async (req, res) => {
  const newOrder = await createOrder(req.body, req.user._id);
  res.status(201).json({ status: 'success', data: { order: newOrder } });
});

// View user's orders
exports.getMyOrders = catchAsync(async (req, res) => {
  const orders = await getOrdersByUser(req.user._id);
  res
    .status(200)
    .json({ status: 'success', results: orders.length, data: { orders } });
});

// Restaurant owner's view of all orders
exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await getAllOrders(req.query);
  res
    .status(200)
    .json({ status: 'success', results: orders.length, data: { orders } });
});

exports.getOrderById = catchAsync(async (req, res) => {
  const orders = await getOrderById(req.user._id);
  res
    .status(200)
    .json({ status: 'success', results: orders.length, data: { orders } });
});

// Confirm or cancel an order
exports.updateOrderStatus = catchAsync(async (req, res) => {
  const updatedOrder = await updateOrderStatus(
    req.params.id,
    req.user._id,
    req.body
  );
  res.status(200).json({ status: 'success', data: { order: updatedOrder } });
});

exports.getTopProfitableCustomers = catchAsync(async (req, res) => {
  const topCustomers = await getTopProfitableCustomers();
  res.status(200).json({ status: 'success', data: { topCustomers } });
});

// ToDo fix this report
exports.getMostProfitableDayLastMonth = catchAsync(async (req, res) => {
  const result = await getMostProfitableDayLastMonth();

  if (result.status === 'not_found') {
    return res.status(404).json({ status: 'fail', message: result.message });
  }

  res.status(200).json({ status: 'success', data: result.data });
});
