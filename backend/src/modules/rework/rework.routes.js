const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const upload =
  require("../../config/multer");

const reworkController =
  require("./rework.controller");

router.get(
  "/my-reworks",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  reworkController.getMyReworks
);

router.patch(
  "/:submissionId",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  upload.single("file"),
  reworkController.resubmitRework
);

module.exports = router;