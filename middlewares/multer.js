import multer from "multer";

// Configure Storage Engine
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Create Middleware with the storage
const upload = multer({ storage: storage });

export default upload;
