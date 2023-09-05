// Main file for exporting the database services

// Importing the services

// Ingest and Search services

const companyDocumentService  = require('./searchAndIngest/companyDocumentService');
const companyService = require('./searchAndIngest/companyService');
const vectorService = require('./searchAndIngest/vectorService');

// Analytical services

const ingestAnalyticsService = require('./analytics/ingestAnalyticsService');

// Export the services

module.exports = {
    companyDocumentService,
    companyService,
    vectorService,
    ingestAnalyticsService,
}