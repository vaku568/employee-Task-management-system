const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    let uploadPath = "uploads/task-files";

    if (
      req.originalUrl.includes("/api/submissions")
    ) {

      uploadPath = "uploads/submissions";

    } else if (
      req.originalUrl.includes("/api/solutions")
    ) {

      uploadPath = "uploads/solutions";

    }

    if (!fs.existsSync(uploadPath)) {

      fs.mkdirSync(uploadPath, {
        recursive: true
      });

    }

    cb(null, uploadPath);

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
      ),
      false
    );

  }

};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;