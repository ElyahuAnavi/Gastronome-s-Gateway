// controllers/dishController.js

const { upload, resizeImages } = require('../config/multerConfig');
const {
  getDishesWithFilters,
  getTopDishes
} = require('../services/dishService');
const { sendResponse } = require('../utils/responseHandler');
const { getOne, createOne, updateOne, deleteOne} = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const dishModel = 'Dish';

exports.uploadDishImages = upload(
  [
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ],
  true
);

exports.resizeDishImages = resizeImages([
  {
    name: 'imageCover',
    width: 2000,
    height: 1333,
    quality: 90,
    format: 'jpeg'
  },
  { name: 'images', width: 2000, height: 1333, quality: 90, format: 'jpeg' }
]);

exports.getDish = getOne(dishModel);
exports.createDish = createOne(dishModel);
exports.updateDish = updateOne(dishModel);
exports.deleteDish = deleteOne(dishModel);

exports.getAllDishes = catchAsync(async (req, res, next) => {
  const filteredDishes = await getDishesWithFilters(req.query, req.user?.role);
  sendResponse(res, 200, filteredDishes, { dishes: filteredDishes });
});

exports.getTopDishes = catchAsync(async (req, res, next) => {
  const topDishes = await getTopDishes();
  sendResponse(res, 200, topDishes, { dishes: topDishes });
});
