// controllers/authController.js

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {
  authenticate,
  optionallyAuthenticate,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserPassword } = require('../services/authService');


/* Middleware function that is used to protect routes from unauthorized access.
   It checks if the user is logged in by verifying the JSON Web Token (JWT)
  provided in the request header or cookie. */
exports.protect = catchAsync(async (req, res, next) => {
  const user = await authenticate(req, next);
  if (user) {
    req.user = user;
    next();
  }
});

exports.conditionalProtect = catchAsync(async (req, res, next) => {
  const user = await optionallyAuthenticate(req);
  req.user = user; // User may be null if not authenticated, but request continues
  next();
});

/* Middleware function that restricts access to certain routes based on the user's role.
 It takes in an array of roles as arguments and returns another middleware
 function that checks if the user's role is included in the provided roles array.
 If the user's role is not included, it returns an error message indicating that the user
 does not have permission to perform the action. If the user's role is included,
 it calls the `next()` function to proceed to the next middleware or route handler. */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};


exports.signup = catchAsync(async (req, res, next) => {
  await signup(req.body, res);
});

exports.login = catchAsync(async (req, res, next) => {
  await login(req.body.email, req.body.password, next, res);
});
exports.logout = (req, res) => {
  logout(res);
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const result = await forgotPassword(req.body.email, req, next);

  if (result) {
    res.status(200).json(result);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body
  await resetPassword(token, password, passwordConfirm, res, next);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  await updateUserPassword(req.user.id, passwordCurrent, password, passwordConfirm, res);
});