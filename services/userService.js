// services/userService.js

const DataAccess = require('../utils/dataAccess');
const AppError = require('../utils/appError');
const { filterObj } = require('../controllers/helperController');

const userModel = 'User';

exports.updateUserDetails = async (userId, body) => {

  // 1) Check for password fields to avoid updates through this route
  if (body.password || body.passwordConfirm) {
    throw new AppError('This route is not for password updates. Please use /updateMyPassword.', 400);
  }

  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(body, 'name', 'email');

  // 3) Perform the update
  const updatedUser = await DataAccess.updateById(userModel, userId, filteredBody);
  if (!updatedUser) {
    throw new AppError('No user found with that ID', 404);
  }

  return updatedUser;
}

exports.deactivateUser = async (userId) => {
  const updatedUser = await DataAccess.updateById(userModel, userId, { active: false });
  if (!updatedUser) {
    throw new AppError('No user found with that ID', 404);
  }
}


