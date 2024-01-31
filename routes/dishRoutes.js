// routes/dishRoutes.js

const express = require('express');
const dishController = require('../controllers/dishController');
const authController = require('../controllers/authController');

const router = express.Router();

// Publicly accessible routes

router
  .route('/')
  .get(authController.conditionalProtect, dishController.getAllDishes)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    dishController.createDish
  );

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/top-5-dishes').get(dishController.getTopDishes);

router
  .route('/:id')
  .get(dishController.getDish)
  .patch(dishController.updateDish)
  .delete(dishController.deleteDish);

module.exports = router;
