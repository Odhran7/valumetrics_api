// This is aggregating all the services provided by the ./src/services

// Main file for exporting the services

// Importing the services

// Database services

const { databaseServices } = require("./databaseService");

// Ingest Services

const { ingestServices } = require("./ingestServices/helpers");

// Export the services

module.exports = {
  databaseServices,
  ingestServices,
};
