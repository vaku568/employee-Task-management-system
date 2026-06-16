const { validationResult } =
  require("express-validator");

const submissionService =
  require("./submission.service");

const createSubmission =
  async (req, res) => {
    try {

      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const submissionData = {
        ...req.body,
        fileUrl: req.file
          ? req.file.path
          : ""
      };

      const submission =
        await submissionService.createSubmission(
          submissionData,
          req.user.id
        );

      res.status(201).json(
        submission
      );

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }
  };

const getAllSubmissions =
  async (req, res) => {
    try {

      const submissions =
        await submissionService.getAllSubmissions();

      res.status(200).json(
        submissions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

const reviewSubmission =
  async (req, res) => {
    try {

      const {
        decision,
        reviewComments
      } = req.body;

      const submission =
        await submissionService.reviewSubmission(
          req.params.id,
          decision,
          req.user.id,
          reviewComments
        );

      res.status(200).json(
        submission
      );

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }
  };

module.exports = {
  createSubmission,
  getAllSubmissions,
  reviewSubmission
};