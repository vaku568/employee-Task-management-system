const express = require("express");

const router = express.Router();

const authMiddleware =
require("../../middleware/authMiddleware");

const roleMiddleware =
require("../../middleware/roleMiddleware");

const upload =
require("../../config/multer");

const submissionController =
require("./submission.controller");

const {
createSubmissionValidation
} = require("./submission.validation");

router.post(
"/",
authMiddleware,
roleMiddleware("EMPLOYEE"),
upload.single("file"),
createSubmissionValidation,
submissionController.createSubmission
);

router.get(
"/",
authMiddleware,
roleMiddleware("TEAM_LEAD"),
submissionController.getAllSubmissions
);

router.patch(
"/:id/review",
authMiddleware,
roleMiddleware("TEAM_LEAD"),
submissionController.reviewSubmission
);

module.exports = router;
