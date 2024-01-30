// routes/dishRoutes.js

const express = require('express');
const dishController = require('../controllers/dishController');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Publicly accessible routes
router.route('/')
.get(authController.conditionalProtect, dishController.getAllDishes)
.post(authController.protect, authController.restrictTo('admin'), dishController.createDish);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/:id')
  .get(dishController.getDish)
  .patch(authController.protect, dishController.updateDish)
  .delete(authController.protect, dishController.deleteDish);

module.exports = router;
