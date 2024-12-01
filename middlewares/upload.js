// middlewares/upload.js

import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  /**
   * Set the destination for the uploaded file
   * @param {Object} req - The Express request object
   * @param {Object} file - The uploaded file
   * @param {Function} cb - The callback function
   */
  destination: (req, file, cb) => {
    // Set your upload directory
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Rename the file
  },
})

/**
 * File filter function for multer to validate file types
 * @param {Object} req - The Express request object
 * @param {Object} file - The uploaded file
 * @param {Function} cb - The callback function
 */
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  const allowedTypes = [
    'image/jpeg', // JPEG images
    'image/png', // PNG images
    'application/pdf', // PDF files
  ]

  if (allowedTypes.includes(file.mimetype)) {
    // File type is valid, accept the file
    cb(null, true)
  } else {
    // File type is invalid, reject the file
    cb(new Error('Unsupported file format'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
})

export default upload
