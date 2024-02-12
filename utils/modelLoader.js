// utils/modelLoader.js
const fs = require('fs');
const path = require('path');

const loadModels = (modelsPath) => {
  fs.readdirSync(modelsPath).forEach((file) => {
    if (path.extname(file) === '.js') {
      require(path.join(modelsPath, file));
    }
  });
};

module.exports = loadModels;
