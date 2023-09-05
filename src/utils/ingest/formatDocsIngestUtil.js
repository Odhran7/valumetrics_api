// This util formats the docs pre-ingestion

const keywordExtractionUtil = require('./keywordExtractionUtil');
const { databaseServices } = require("../../services");

// This function adds to vector db and adds relevant keywords

const prepareDocumentForIngestionUtil = async (doc) => {
    const keywords = keywordExtractionUtil(doc.pageContent, 25);
    const vector_id_obj = await databaseServices.vectorService.createVector({document_id: doc.metadata.id});
    const vector_id = vector_id_obj.id;
    return new Document({
        pageContent: doc.pageContent,
        metadata: { ...doc.metadata, keywords: keywords, vector_id: vector_id },
    });
};

// This function removes empty/null docs

const filterValidDocsUtil = (docs) => {
    return docs.filter(Boolean);
};

module.exports = {
    prepareDocumentForIngestionUtil,
    filterValidDocsUtil,
};
