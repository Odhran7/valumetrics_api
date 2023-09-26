// This controller abstracts away the logic for different endpoints

const ingestTemplateController = (ingestService, docType) => {
    return async (req, res) => {
      try {
        const ticker = req.params.tickerValue;
        if (!ticker) {
          return res.status(400).json({
            success: false,
            message: "Ticker value is required",
          });
        }
  
        await ingestService(ticker);
  
        res.status(200).json({
          success: true,
          message: `${ticker} ${docType} docs were ingested successfully!`,
        });
  
      } catch (error) {
        if (error.message === "Ticker not found") {
          return res.status(404).json({
            success: false,
            message: `Ticker ${ticker} was not found!`,
          });
        }
  
        console.error(`Error in ${docType} ingestHandler:`, error.message);
        res.status(500).json({
          success: false,
          message: `Failed to ingest ${docType} docs data`,
          error: error.message,
        });
      }
    };
  };

export default ingestTemplateController;