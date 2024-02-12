const AppError = require('../utils/appError');
const DataAccess = require('../utils/dataAccess');
const APIFeatures = require('../utils/apiFeatures');

// Directly export the executeQueryWithFeatures function
exports.executeQueryWithFeatures = async (
  modelName,
  queryObject,
  reqQuery
) => {
  const model = DataAccess.getModel(modelName);
  const features = new APIFeatures(model.find(queryObject), reqQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  return await features.query;
};

exports.ensureFound = (doc, errorMessage = 'No document found')=> {
  if (!doc) throw new AppError(errorMessage, 404);
};

// Filter out allowed fields from an object
exports.filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};