const express = require('express');
const userRouter = require('./userRoutes');
const dishRouter = require('./dishRoutes');
const orderRouter = require('./orderRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/dishes', dishRouter);
router.use('/orders', orderRouter);

module.exports = router;