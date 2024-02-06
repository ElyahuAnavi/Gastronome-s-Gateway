// routes/orderRoutes.js

const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const validateRequest = require('../utils/validateRequest');
const orderValidationSchema = require('../validations/orderValidation');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(validateRequest(orderValidationSchema),orderController.createOrder)
  .get(orderController.getMyOrders);

router.use(authController.restrictTo('admin'));

router.route('/all').get(orderController.getAllOrders); // --> api/v1/orders/all?isSelfCollection=true

router.get('/top-customers', orderController.getTopProfitableCustomers);

router.get(
  '/top-day-last-month',
  orderController.getMostProfitableDayLastMonth
);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(validateRequest(orderValidationSchema),orderController.updateOrderStatus);

module.exports = router;
