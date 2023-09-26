// Main file for exporting the ingestion services

// Importing the services

// Helper Services

import { ingestDocs, ingestDoc } from "./ingestPineconeService";
import { ingest8KDocsService } from "./ingest8kDocsService";
import { ingest10K10QDocsService } from "./ingest10k10qDocsService";
import { ingest13FDocsService } from "./ingest13fDocsService";
import { ingestEarningsTranscriptsService } from "./ingestEarningsTranscriptsService";
import { ingestNewsService } from "./ingestNewsService";
import { ingestPatentsService } from "./ingestPatentsService";

// Define the ingest function

const ingest = async (ticker, databaseServices) => {
  try {
    // Sequential Execution:
    await ingest8KDocsService(ticker, databaseServices);
    await ingest10K10QDocsService(ticker, databaseServices);
    await ingest13FDocsService(ticker, databaseServices);
    await ingestEarningsTranscriptsService(ticker, databaseServices);
    await ingestNewsService(ticker, databaseServices);
    await ingestPatentsService(ticker, databaseServices);

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

export {
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
