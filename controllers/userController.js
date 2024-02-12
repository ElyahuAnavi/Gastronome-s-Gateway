// controllers/userController.js

const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const userModel = 'User';

// get the current user's profile
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update the current user's information
exports.updateMe = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserDetails(
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
  await userService.deactivateUser(req.user.id);
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

exports.getUser = factory.getOne(userModel);
exports.getAllUsers = factory.getAll(userModel);
exports.updateUser = factory.updateOne(userModel);
exports.deleteUser = factory.deleteOne(userModel);
