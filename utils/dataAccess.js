// utils/dataAccess.js

const mongoose = require('mongoose');
const AppError = require('./appError');

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

  async create(modelName, data) {
    const Model = this.getModel(modelName);
    const document = await Model.create(data);
    return document;
  }

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

  async deleteById(modelName, id) {
    const Model = this.getModel(modelName);
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      throw new AppError('No document found with that ID', 404);
    }
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
