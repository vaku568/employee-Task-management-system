const reworkService =
  require("./rework.service");

const getMyReworks =
  async (req, res) => {
    try {

      const reworks =
        await reworkService.getMyReworks(
          req.user.id
        );

      res.status(200).json(
        reworks
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

const resubmitRework =
  async (req, res) => {
    try {

      const submission =
        await reworkService.resubmitRework(
          req.params.submissionId,
          req.file.path
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
  getMyReworks,
  resubmitRework
};