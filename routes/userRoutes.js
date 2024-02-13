// routes/userRoutes.js

const express = require('express');

const {
  getMe,
  getUser,
  updateMe,
  deleteUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteMe
} = require('./../controllers/userController');

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('./../controllers/authController');

const {
  registerValidationSchema,
  updateUserValidationSchema,
  changePasswordValidationSchema,
} = require('../validations/userValidation');

const validateRequest = require('../utils/validateRequest');
const router = express.Router();

// Routes for user signup, login, logout, password reset, and update
router.post('/signup', validateRequest(registerValidationSchema), signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware (authentication required for subsequent routes)
router.use(protect);

// Routes for updating user's password and managing user's own profile
router.patch('/updateMyPassword', validateRequest(changePasswordValidationSchema), updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', validateRequest(updateUserValidationSchema), protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

// Restrict following routes to admin users
router.use(restrictTo('admin'));

// Routes for managing all users
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// Routes for getting, updating, and deleting a specific user by ID
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
