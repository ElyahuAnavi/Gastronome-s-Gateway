// controllers/handlerFactory.js

const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const DataAccess = require('../utils/dataAccess');

/**
 * Delete one document from the specified model.
 * @param {modelName} modelName - The name of the  model to perform the deletion on.
 * @returns {Function} - The asynchronous function to handle the deletion.
 */
exports.deleteOne = (modelName) =>
  catchAsync(async (req, res, next) => {
    await DataAccess.deleteById(modelName, req.params.id);

    // Send a success response with no data (204 No Content)
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

/**
 * Update one document in the specified model.
 * @param {modelName} modelName - The name of the  model to perform the update on.
 * @returns {Function} - The asynchronous function to handle the update.
 */
exports.updateOne = (modelName) =>
  catchAsync(async (req, res, next) => {
    const doc = await DataAccess.updateById(modelName, req.params.id, req.body);


    // Send a success response with the updated data (200 OK)
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 * Create one document in the specified model.
 * @param {modelName} modelName - The name of the  model to create a new document in.
 * @returns {Function} - The asynchronous function to handle the creation.
 */
exports.createOne = (modelName) =>
  catchAsync(async (req, res, next) => {
    const doc = await DataAccess.create(modelName, req.body);

    // Send a success response with the created data (201 Created)
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 * Get one document from the specified model.
 * @param {modelName} modelName - The name of the  model to retrieve a document from.
 * @param {Object} popOptions - Options for populating related fields.
 * @returns {Function} - The asynchronous function to handle the retrieval.
 */
exports.getOne = (modelName, popOptions) =>
  catchAsync(async (req, res, next) => {
    const doc = await DataAccess.findById(modelName, req.params.id, popOptions);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 * Get all documents from the specified model.
 * @param {modelName} modelName - The name of the  model to retrieve documents from.
 * @returns {Function} - The asynchronous function to handle the retrieval of all documents.
 */
exports.getAll = (modelName) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(DataAccess.getModel(modelName).find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query to retrieve the documents
    const doc = await features.query;

    // Send a success response with the retrieved data
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
