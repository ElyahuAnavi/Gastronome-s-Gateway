// routes/orderRoutes.js

const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getTopProfitableCustomers,
  getMostProfitableDayLastMonth,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, restrictTo, } = require('../controllers/authController');

const validateRequest = require('../utils/validateRequest');
const orderValidationSchema = require('../validations/orderValidation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validateRequest(orderValidationSchema), createOrder)
  .get(getMyOrders);

router.use(restrictTo('admin'));

router.route('/all').get(getAllOrders); // --> api/v1/orders/all?isSelfCollection=true

router.get('/top-customers', getTopProfitableCustomers);

router.get(
  '/top-day-last-month',
  getMostProfitableDayLastMonth
);

router
  .route('/:id')
  .get(getOrder)
  .patch(updateOrderStatus)

module.exports = router;
