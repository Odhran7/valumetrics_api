// This service will be used to ingest a singular doc into the database

const { Document } = require("langchain/document");
const { ingestDoc } = require('./ingestPineconeService');

// This ingests a singular doc into the db -> Think earnings transcipts 

const ingestDocService = async (url, metadata) => {
    const { company_id, document_type, year, upload_timestamp, link, month } = metadata;
    // Extract text from pdf
    const content = await getContent(url);
    const doc = new Document({ pageContent: content, metadata: metadata})
    const result = await ingestDoc(doc);
}

// This function gets the textual content from a pdf

const getContent = async (url) => {

}