const Dish = require('./../models/dishModel');
const factory = require('./handlerFactory');

exports.getAllDishes = factory.getAll(Dish);
exports.getDish = factory.getOne(Dish);
exports.createDish = factory.createOne(Dish);
exports.updateDish = factory.updateOne(Dish);
exports.deleteDish = factory.deleteOne(Dish);
