// services/dishService.js

const DataAccess = require('../utils/dataAccess');
const { executeQueryWithFeatures } = require('./helperService');

const dishModel = 'Dish';
const orderModel = 'Order';

exports.getDishesWithFilters = async (query, userRole) => {
  const dishes = await executeQueryWithFeatures(dishModel, {}, query);

  return dishes.map(dish => {
    if (userRole === 'admin') {
      const { __v, ...details } = dish.toObject();
      return details;
    }
    return {
      name: dish.name,
      description: dish.description,
      price: dish.price
    };
  });
};

exports.getTopDishes = async () => {
  const pipeline = [
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
  ];

  return DataAccess.aggregate(orderModel, pipeline);
};
