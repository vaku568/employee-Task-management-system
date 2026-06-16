const Submission =
  require("../../models/Submission");

const Task =
  require("../../models/Task");

const Solution =
  require("../../models/Solution");

const createSubmission = async (
  submissionData,
  employeeId
) => {

  const submission =
    await Submission.create({
      ...submissionData,
      employeeId
    });

  await Task.findByIdAndUpdate(
    submissionData.taskId,
    {
      status:
        submissionData.submissionType
    }
  );

  return submission;
};

const getAllSubmissions =
  async () => {

    const submissions =
      await Submission.find()
        .populate(
          "employeeId",
          "name email employeeId team"
        )
        .populate(
          "taskId",
          "studentName moduleCode status"
        );

    return submissions;
  };

const reviewSubmission =
  async (
    submissionId,
    decision,
    teamLeadId,
    reviewComments
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

    submission.reviewStatus =
      decision;

    submission.reviewComments =
      reviewComments || "";

    submission.reviewedBy =
      teamLeadId;

    submission.reviewedAt =
      new Date();

    await submission.save();

    if (
      decision === "APPROVED"
    ) {

      await Task.findByIdAndUpdate(
        submission.taskId,
        {
          status: "APPROVED"
        }
      );

      await Solution.create({
        taskId:
          submission.taskId,
        employeeId:
          submission.employeeId,
        finalFile:
          submission.fileUrl
      });

    } else if (
      decision === "REWORK"
    ) {

      await Task.findByIdAndUpdate(
        submission.taskId,
        {
          status: "REWORK"
        }
      );

    }

    return submission;
  };

module.exports = {
  createSubmission,
  getAllSubmissions,
  reviewSubmission
};