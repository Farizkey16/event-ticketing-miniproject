import multer from "multer";

export const uploaderMemory = () => {
  return multer({
    storage: multer.memoryStorage(), // Store uploaded files in RAM, not disk, accessible via req.file.buffer
    limits: { fileSize: 1 * 1024 * 2048 }, // Limiting filesize to 2MB, auto-reject if more than that
    fileFilter: (req, file: Express.Multer.File, callback) => {
      const allowedExt = /\.(jpeg|jpg|png)$/i;
      const allowedMime = ["image/jpeg", "image/png"];

      if (!allowedExt.test(file.originalname)) {
        return callback(new Error("WRONG_FILE_EXTENSION"));
      }

      if (!allowedMime.includes(file.mimetype)) {
        return callback(new Error("INVALID_MIME_TYPE"));
      }

      callback(null, true);
    },
  });
};
