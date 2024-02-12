// utils/dataAccess.js

const mongoose = require('mongoose');
const AppError = require('./appError');
const bcrypt = require('bcryptjs');

/* The `DataAccess` class is a singleton class that provides methods for interacting with a MongoDB
database, including creating, retrieving, updating, and deleting documents. */
class DataAccess {
  /**
   * Constructor that ensures only one instance of the DataAccess class is created.
   * @returns The `DataAccess.instance` is being returned.
   */
  constructor() {
    if (!DataAccess.instance) {
      DataAccess.instance = this;
    }
    return DataAccess.instance;
  }

  /**
   * Returns the mongoose model for a given model name.
   * @param modelName - The modelName parameter is a string that represents the name of the model you
   * want to retrieve from the mongoose library.
   * @returns the mongoose model with the specified modelName.
   */
  getModel(modelName) {
    return mongoose.model(modelName);
  }

  /**
   * Creates a new document in the specified model, hashing the password if provided and
   * removing it from the returned document.
   * @param modelName - The modelName parameter is the name of the model that you want to create a
   * document for. It is used to retrieve the appropriate model from the database.
   * @param data - The `data` parameter is an object that contains the data to be used for creating a
   * new document in the specified model. It typically includes properties such as `username`, `email`,
   * `password`, etc.
   * @returns The document created by the Model is being returned.
   */
  async create(modelName, data) {
    const Model = this.getModel(modelName);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    const document = await Model.create(data);
    if (document.password) {
      document.password = undefined; // Ensure the password is not returned
    }
    return document;
  }

  /**
   * The function finds a document by its ID in a specified model and returns it, optionally populating
   * specified fields.
   * @param modelName - The modelName parameter is the name of the model you want to find the document
   * in. It is used to retrieve the appropriate model from the database.
   * @param id - The `id` parameter is the unique identifier of the document you want to find in the
   * database. It is used to query the database and retrieve the document with the matching ID.
   * @param populateOptions - The `populateOptions` parameter is an optional parameter that allows you
   * to specify which fields of the document you want to populate with data from other collections. It
   * can be an object or a string.
   * @returns The document that matches the given ID is being returned.
   */
  async findById(modelName, id, populateOptions) {
    const Model = this.getModel(modelName);
    let query = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query;
    if (!document) {
      throw new AppError('No document found with that ID', 404);
    }
    return document;
  }

  /**
   * The function updates a document in a MongoDB collection by its ID and returns the updated
   * document.
   * @param modelName - The modelName parameter is the name of the model in the database that you want
   * to update. It is used to retrieve the appropriate model from the database.
   * @param id - The `id` parameter is the unique identifier of the document you want to update in the
   * database. It is used to find the document that needs to be updated.
   * @param updateData - The `updateData` parameter is an object that contains the fields and values to
   * be updated in the document.
   * @returns the updated document.
   */
  async updateById(modelName, id, updateData) {
    const Model = this.getModel(modelName);
    const document = await Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    if (!document) {
      throw new AppError('No document found with that ID', 404);
    }
    return document;
  }

  /**
   * The function deletes a document from a MongoDB collection based on its ID and throws an error if
   * no document is found.
   * @param modelName -  represents the name of the model in the database that you want to delete a document from.
   * @param id -  unique identifier of the document that you want to delete
   */
  async deleteById(modelName, id) {
    const Model = this.getModel(modelName);
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      throw new AppError('No document found with that ID', 404);
    }
  }

  /**
   * Finds a document by its email in a specified model.
   * @param modelName - Name of the model.
   * @param email - Email to find.
   * @returns The document matching the email.
   */
  async findByEmail(modelName, email) {
    const Model = this.getModel(modelName);
    const document = await Model.findOne({ email });
    return document;
  }

  /**
   * Compares the provided password with the hashed password stored in the database.
   * @param candidatePassword - The password provided by the user.
   * @param userPassword - The hashed password stored in the database.
   * @returns A boolean indicating whether the passwords match.
   */
  async comparePassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  /**
   * Updates a user's password and related fields.
   * @param modelName - The name of the user model.
   * @param userId - The user's ID.
   * @param newPassword - The new password to be hashed and stored.
   */
  async updatePassword(modelName, userId, newPassword) {
    const Model = this.getModel(modelName);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Model.findByIdAndUpdate(userId, {
      password: hashedPassword,
      passwordChangedAt: Date.now()
    });
  }

  // In DataAccess class

/**
 * Resets a user's password, handling hashing and invalidating any reset token.
 * @param email - The user's email to identify the account.
 * @param newPassword - The new password to be set.
 */
async resetUserPassword(email, newPassword) {
  const Model = this.getModel('User');
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Assume the user model has fields for reset tokens that need to be cleared upon password reset
  const updatedUser = await Model.findOneAndUpdate(
    { email, passwordResetToken: { $exists: true }, passwordResetExpires: { $gt: Date.now() } },
    {
      password: hashedPassword,
      passwordResetToken: undefined, // Clear the reset token
      passwordResetExpires: undefined, // Clear the token expiry
      passwordChangedAt: Date.now() // Optionally track when the password was changed
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError('No user found with that email or token is invalid', 404);
  }

  return updatedUser;
}

  /**
   * Generates a password reset token for a user and updates the user document.
   * @param email - The user's email address.
   * @returns The reset token or throws an error if the user is not found.
   */
  async generatePasswordResetToken(email) {
    const Model = this.getModel('User');
    const user = await Model.findOne({ email });
    if (!user) {
      throw new AppError('No user found with that email', 404);
    }

    const resetToken = user.createPasswordResetToken(); // Assuming this method exists on the user model
    await user.save({ validateBeforeSave: false }); // Save the user with the new token and expiration

    return resetToken; // You may return the reset token for email sending purposes
  }

  async aggregate(modelName, pipeline) {
    const Model = this.getModel(modelName);
    try {
      const results = await Model.aggregate(pipeline);
      return results;
    } catch (error) {
      throw new AppError('Aggregation failed', 500);
    }
  }
}

const instance = new DataAccess();
Object.freeze(instance);

module.exports = instance;
