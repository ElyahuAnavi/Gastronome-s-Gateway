// controllers/userController.js

const catchAsync = require('./../utils/catchAsync');
const { getOne, getAll, updateOne, deleteOne} = require('./handlerFactory');
const {deactivateUser, updateUserDetails } = require('../services/userService');
const userModel = 'User';

// get the current user's profile
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update the current user's information
exports.updateMe = catchAsync(async (req, res) => {
  const updatedUser = await updateUserDetails(
    req.user.id,
    req.body
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Deactivate (soft delete) the current user
exports.deleteMe = catchAsync(async (req, res) => {
  await deactivateUser(req.user.id);
  res.status(204).json({
      status: 'success',
      data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = getOne(userModel);
exports.getAllUsers = getAll(userModel);
exports.updateUser = updateOne(userModel);
exports.deleteUser = deleteOne(userModel);
