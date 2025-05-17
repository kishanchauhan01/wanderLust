import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.originalname.trim().replace(/\s+/g, "_");
    cb(null, sanitizedFilename);
  },
});

export const upload = multer({
  storage,
});
