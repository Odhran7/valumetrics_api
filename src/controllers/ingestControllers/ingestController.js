// This is the controller for the ingest function

const { ingestServices } = require("../../services/index");

// This handles GET /api/v1/ingest/ticker=YOUR_TICKER_VALUE

const ingestController = async (req, res) => {
  try {
    const ticker = req.params.tickerValue;

    if (!ticker) {
      return res.status(400).json({
        success: false,
        message: "Ticker value is required",
      });
    }

    await ingestServices.ingest10K10QDocsService(ticker);
    res.status(200).json({
      success: true,
      message: `${ticker} was ingested successfully!`,
    });
  } catch (error) {

    if (error.message === "Ticker not found") {
      return res.status(404).json({
        success: false,
        message: `Ticker ${ticker} was not found! We only support SEC (American) companies`,
      });
    }
    console.error("Error in ingestHandler:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to ingest data",
      error: error.message,
    });
  }
};

module.exports = ingestController;
