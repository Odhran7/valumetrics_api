// This is the main aggregation file for the controllers

// Import the controllers

// Ingest

const { ingestControllers } = require("./ingestControllers/index");

// Export the controllers

module.exports = {
  ingestControllers,
};
