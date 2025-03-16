import multer from 'multer';
import path from 'path';

// Configure multer for community images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Save files to the /images directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Include the extension in the filename
  },
});

const upload = multer({ storage });

export default upload;