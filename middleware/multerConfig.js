const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueId = Date.now() + "-" + Math.round(Math.random() + 1e9);
    const fileExtention = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtention);
    cb(null, `${baseName}-${uniqueId}${fileExtention}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
