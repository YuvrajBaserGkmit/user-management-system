const path = require('path');
const multer = require('multer');

// Allowed extensions
const fileTypes = /jpeg|jpg|png|gif/;

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// Multer configuration for file filter
const fileFilter = (req, file, cb) => {
  // file type
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // mime type
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(
      new Error('Only .png, .jpg, .jpeg and .gif format allowed!'),
      false,
    );
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
  upload,
};
