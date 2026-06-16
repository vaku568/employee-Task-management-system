const Submission =
  require("../../models/Submission");

const getMyReworks =
  async (employeeId) => {

    const reworks =
      await Submission.find({
        employeeId,
        reviewStatus: "REWORK"
      })
        .populate(
          "taskId",
          "studentName moduleCode"
        );

    return reworks;
};

const resubmitRework =
  async (
    submissionId,
    filePath
  ) => {

    const submission =
      await Submission.findById(
        submissionId
      );

    if (!submission) {
      throw new Error(
        "Submission not found"
      );
    }

    submission.fileUrl =
      filePath;

    submission.reviewStatus =
      "PENDING";

    submission.reviewComments =
      "";

    submission.reviewedBy =
      null;

    submission.reviewedAt =
      null;

    await submission.save();

    return submission;
};

module.exports = {
  getMyReworks,
  resubmitRework
};