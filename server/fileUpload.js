// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the file upload functionality

// Image upload
const multer = require("multer");
const path = require("path");

// Configure storage for multer
const storage = multer.diskStorage({
    // Define destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    // Define filename for uploaded files
    filename: function (req, file, cb) {
        // Generate a unique filename with current timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// Export multer instance with configured storage
exports.uploadfile = multer({ storage: storage });
