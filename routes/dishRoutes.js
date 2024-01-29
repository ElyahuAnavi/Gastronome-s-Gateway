const express = require('express');
const dishController = require('../controllers/dishController');
const authController = require('../controllers/authController');

const router = express.Router();

// Publicly accessible routes
router.route('/')
  .get(dishController.getAllDishes)
  .post(authController.protect, authController.restrictTo('admin'), dishController.createDish);

router.route('/:id')
  .get(dishController.getDish)
  .patch(authController.protect, authController.restrictTo('admin'), dishController.updateDish)
  .delete(authController.protect, authController.restrictTo('admin'), dishController.deleteDish);

module.exports = router;
