// Main file for exporting the ingestion services

// Importing the services

// Helper Services

const { ingestDocs, ingestDoc } = require("./helpers/ingestPineconeService");
const { ingest8KDocsService } = require("./helpers/ingest8kDocsService");
const {
  ingest10K10QDocsService,
} = require("./helpers/ingest10k10qDocsService");
const { ingest13FDocsService } = require("./helpers/ingest13fDocsService");
const {
  ingestEarningsTranscriptsService,
} = require("./helpers/ingestEarningsTranscriptsService");
const { ingestNewsService } = require("./helpers/ingestNewsService");
const { ingestPatentsService } = require("./helpers/ingestPatentsService");

// Define the ingest function

const ingest = async (ticker) => {
  try {
    // Sequential Execution:
    await ingest8KDocsService(ticker);
    await ingest10K10QDocsService(ticker);
    await ingest13FDocsService(ticker);
    await ingestEarningsTranscriptsService(ticker);
    await ingestNewsService(ticker);
    await ingestPatentsService(ticker);

    // Parallel Execution - Once it works lol
    /*
        await Promise.all([
            ingest8KDocsService(ticker),
            ingest10K10QDocsService(ticker),
            ingest13FDocsService(ticker),
            ingestEarningsTranscriptsService(ticker),
            ingestNewsService(ticker),
            ingestPatentsService(ticker)
        ]);
        */

    return {
      success: true,
      message: "All ingestion services executed successfully.",
    };
  } catch (error) {
    console.error("Error in the main ingest function:", error.message);
    return {
      success: false,
      message: "Failed to execute all ingestion services.",
      error: error.message,
    };
  }
};

// Export the services

module.exports = {
  ingestDoc,
  ingestDocs,
  ingest8KDocsService,
  ingest10K10QDocsService,
  ingest13FDocsService,
  ingestEarningsTranscriptsService,
  ingestNewsService,
  ingestPatentsService,
  ingest,
};
