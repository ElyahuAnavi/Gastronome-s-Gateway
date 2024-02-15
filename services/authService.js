// services/authService.js

const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { jwtSecret, jwtExpiresIn, jwtCookieExpiresIn, nodeEnv } = require('../config/vars');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const dataAccess = require('../utils/dataAccess');

const userModel = 'User';

const signToken = (id) => jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });


const createTokenSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: nodeEnv === 'production'
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined; // Hide password from output

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

// Extract token from request
const extractToken = (req) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    return req.cookies.jwt;
  }
  return null;
};

// Verify token and get decoded data
const verifyToken = async (token) => {
  try {
    return await promisify(jwt.verify)(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

const getUserAndCheck = async (decoded, next) => {
  if (!decoded) {
    return next(new AppError('Invalid token or token expired', 401));
  }

  const currentUser = await dataAccess.findById(userModel, decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  return currentUser;
};

exports.authenticate = async (req, next) => {
  const token = extractToken(req);
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = await verifyToken(token);
  return await getUserAndCheck(decoded, next);
};

exports.optionallyAuthenticate = async (req) => {
  const token = extractToken(req);
  if (token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      return await dataAccess.findById(userModel, decoded.id);
    }
  }
  return null; // Return null if no token or token is invalid
};

exports.signup = async (userData, res) => {
  const newUser = await dataAccess.create(userModel, userData);
  return createTokenSendResponse(newUser, 201, res);
};

exports.login = async (email, password, next, res) => {
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await dataAccess.findOneByConditions(userModel, { email }, '+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  return createTokenSendResponse(user, 200, res);
};

exports.logout = (res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: nodeEnv === 'production'
  });
  res.status(200).json({ status: 'success' });
};

exports.forgotPassword = async (email, req, next) => {
  // 1) Get user based on POSTed email
  const user = await dataAccess.findOneByConditions(userModel, { email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await dataAccess.saveDocument(user, { validateBeforeSave: false });

  // 3) Construct reset URL and email message
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    return {
      status: 'success',
      message: 'Token sent to email!',
    };
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await dataAccess.saveDocument(user, { validateBeforeSave: false });

    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
};

exports.resetPassword = async (token, newPassword, newPasswordConfirm, res, next) => {
  // 1) Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2) Find user by token and ensure token hasn't expired
  const user = await dataAccess.findOneByConditions(userModel, {
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update user's password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await dataAccess.saveDocument(user);

  // 4) Log the user in (send JWT)
  createTokenSendResponse(user, 200, res);
};

exports.updateUserPassword = async (userId, currentPassword, newPassword, newPasswordConfirm, res) => {
  const user = await dataAccess.findOneByConditions(userModel, { _id: userId }, '+password');

  // Verify current password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError('Your current password is wrong.', 401);
  }

  // Update password and save user
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await dataAccess.saveDocument(user);

  createTokenSendResponse(user, 200, res);
};