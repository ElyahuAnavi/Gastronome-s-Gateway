// utils/responseHandler.js

exports.sendResponse = (res, statusCode, results, data, key = 'data') => {
  res.status(statusCode).json({
    status: 'success',
    results: results.length, // Assumes 'results' is an array. Adjust if not applicable.
    [key]: data
  });
};
