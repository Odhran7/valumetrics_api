// This is aggregating all the services provided by the ./src/services

// Main file for exporting the services

// Importing the services

// Database services

const { databaseServices } = require('./databaseService');
const { ingestService } = require('./ingestService');

// Ingest Services


// Export the services

module.exports = {
    databaseServices,
    ingestService,
}