const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (
      req.originalUrl.includes(
        "/api/submissions"
      )
    ) {

      cb(
        null,
        "uploads/submissions"
      );

    } else {

      cb(
        null,
        "uploads/task-files"
      );

    }

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);

  }

});

const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
    ".zip"
  ];

  const ext =
    path.extname(
      file.originalname
    ).toLowerCase();

  if (
    allowedTypes.includes(ext)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Invalid file type"
      )
    );

  }

};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;