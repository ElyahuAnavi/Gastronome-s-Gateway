// controllers/dishController.js
const Dish = require('./../models/dishModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllDishes = catchAsync(async (req, res, next) => {
  let query = Dish.find();

  // Execute the query to retrieve the documents
  const dishes = await query;

  // Filter the data based on user role
  const filteredDishes = dishes.map(dish => {
    if (req.user && req.user.role === 'admin') {
      // Admins see all details (excluding __v)
      const { __v, ...dishDetails } = dish.toObject();
      return dishDetails;
    } else {
      // Normal users see limited details
      return {
        name: dish.name,
        description: dish.description,
        price: dish.price
      };
    }
  });

  res.status(200).json({
    status: 'success',
    results: filteredDishes.length,
    data: { dishes: filteredDishes }
  });
});

exports.getDish = factory.getOne(Dish);
exports.createDish = factory.createOne(Dish);
exports.updateDish = factory.updateOne(Dish);
exports.deleteDish = factory.deleteOne(Dish);
