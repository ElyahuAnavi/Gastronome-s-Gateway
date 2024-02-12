// routes/dishRoutes.js

const express = require('express');
const {
  getAllDishes,
  createDish,
  getTopDishes,
  getDish,
  uploadDishImages,
  resizeDishImages,
  updateDish,
  deleteDish
} = require('../controllers/dishController'); 
const { conditionalProtect, protect, restrictTo } = require('../controllers/authController');

const validateRequest = require('../utils/validateRequest');
const dishValidationSchema = require('../validations/dishValidation');

const router = express.Router();

router
  .route('/')
  .get(conditionalProtect, getAllDishes)
  .post(
    protect,
    restrictTo('admin'),
    validateRequest(dishValidationSchema),
    createDish
  );

router.use(protect, restrictTo('admin'));

router.route('/top-5-dishes').get(getTopDishes);

router
  .route('/:id')
  .get(getDish)
  .patch(
    uploadDishImages,
    resizeDishImages,
    validateRequest(dishValidationSchema),
    updateDish
  )
  .delete(deleteDish);

module.exports = router;
