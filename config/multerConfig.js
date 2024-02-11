const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError'); 
const catchAsync = require('./../utils/catchAsync');

// Function to configure storage
const multerStorage = (isMemoryStorage = true) =>
  isMemoryStorage ? multer.memoryStorage() : multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/img'); // Adjust the path as necessary
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
  });

// Function to filter files (images only)
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};


exports.upload = (fields, isMemoryStorage = true) => {
  const storage = multerStorage(isMemoryStorage);
  const fileFilter = multerFilter;
  const upload = multer({ storage, fileFilter });

  if (fields instanceof Array) {
    return upload.fields(fields);
  } else {
    return upload.single(fields); // For single file upload scenarios
  }
};

// Utility for resizing images
exports.resizeImages = (imageDetails) => catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = []; // Initialize images array in req.body

  await Promise.all(imageDetails.map(async (detail) => {
    const { name, width, height, quality, format } = detail;
    const files = req.files[name];

    if (files) {
      await Promise.all(files.map(async (file, i) => {
        const filename = `${name}-${req.params.id}-${Date.now()}-${i + 1}.${format}`;
        await sharp(file.buffer)
          .resize(width, height)
          .toFormat(format)
          .jpeg({ quality })
          .toFile(`public/img/${filename}`);

        req.body[name] = req.body[name] || [];
        req.body[name].push(filename);
      }));
    }
  }));

  next();
});
