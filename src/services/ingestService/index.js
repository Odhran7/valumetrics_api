// Main file for exporting the ingestion services

// Importing the services

// Helper Services

const { ingestDocs, ingestDoc } = require('./helpers/ingestPineconeService');
const { ingest8KDocsService } = require('./helpers/ingest8kDocsService');
const { ingest10K10QDocsService } = require('./helpers/ingest10k10qDocsService');
const { ingest13FDocsService } = require('./helpers/ingest13fDocsService');


// Export the services

module.exports = {
    ingestDoc,
    ingestDocs,
    ingest8KDocsService,
    ingest10K10QDocsService,
    ingest13FDocsService,
}