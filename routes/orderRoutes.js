// routes/orderRoutes.js

const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(orderController.createOrder)
  .get(orderController.getMyOrders);

router.use(authController.restrictTo('admin'));

router.route('/all').get(orderController.getAllOrders);

router.get('/top-customers', orderController.getTopProfitableCustomers);

router.get(
  '/top-day-last-month',
  orderController.getMostProfitableDayLastMonth
);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrderStatus);

module.exports = router;
