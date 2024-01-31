// controllers/dishController.js
const Dish = require('./../models/dishModel');
const Order = require('../models/orderModel');
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



exports.getTopDishes = catchAsync(async (req, res, next) => {
  const topDishes = await Order.aggregate([
    // Deconstruct the dishes array to treat each dish as a separate document
    { $unwind: '$dishes' },
    // Group by dish and calculate total orders and total quantity ordered
    {
      $group: {
        _id: '$dishes.dish',
        orderCount: { $sum: 1 }, // Count of how many times the dish was ordered
        totalQuantity: { $sum: '$dishes.quantity' } // Total quantity of the dish ordered
      }
    },
    // Sort by the most frequently ordered dishes
    { $sort: { orderCount: -1 } },
    // Limit to top 5
    { $limit: 5 },
    // Look up dish details from the dishes collection
    {
      $lookup: {
        from: 'dishes',
        localField: '_id',
        foreignField: '_id',
        as: 'dishDetails'
      }
    },
    // Unwind the result from the lookup to normalize the data
    { $unwind: '$dishDetails' },
    // Optionally, project to format the output
    {
      $project: {
        name: '$dishDetails.name',
        description: '$dishDetails.description',
        price: '$dishDetails.price',
        orderCount: 1,
        totalQuantity: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: topDishes.length,
    data: {
      dishes: topDishes
    }
  });
});
