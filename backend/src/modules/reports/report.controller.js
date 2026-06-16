const reportService =
  require("./report.service");

const getSummaryReport =
  async (req, res) => {
    try {

      const report =
        await reportService.getSummaryReport();

      res.status(200).json(
        report
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

module.exports = {
  getSummaryReport
};