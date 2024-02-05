// services/dbService.js

const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

class DataAccess {
  constructor() {
    if (!DataAccess.instance) {
      DataAccess.instance = this;
    }
    return DataAccess.instance;
  }

  getModel(modelName) {
    return mongoose.model(modelName);
  }

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
}

const instance = new DataAccess();
Object.freeze(instance);

module.exports = instance;
