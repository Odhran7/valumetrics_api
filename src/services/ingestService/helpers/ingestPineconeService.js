// This service is used to ingest content into the vector db

const { pineconeClient } = require("../../../../config/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const {
  prepareDocumentForIngestionUtil,
} = require("../../../utils/ingest/formatDocsIngestUtil");
const { PineconeStore } = require("langchain/vectorstores/pinecone");

// Specify the index we are connecting to

const index = pineconeClient.Index("demo");

// This function ingest docs with a load of metadata into vector db

const ingestDocs = async (docsWithMetadata) => {
  try {
    const preparedDocs = await Promise.all(
      docsWithMetadata.map(prepareDocumentForIngestionUtil)
    );
    const validDocs = preparedDocs.filter(Boolean);
    const vectorIds = validDocs.map((doc) => doc.metadata.vector_id.toString());

    if (validDocs.length > 0) {
      const pineconeStore = new PineconeStore(new OpenAIEmbeddings(), {
        index,
      });
      const res = await pineconeStore.addDocuments(validDocs, vectorIds);
      return res;
    }
  } catch (error) {
    console.error("Error in ingestDocs:", error.message);
    throw error;
  }
};

// This function ingests a doc with metadata into vector db

const ingestDoc = async (docWithMetadata) => {
  try {
    const preparedDoc = await prepareDocumentForIngestionUtil(docWithMetadata);
    if (preparedDoc) {
      const pineconeStore = new PineconeStore(new OpenAIEmbeddings(), {
        index,
      });
      const res = await pineconeStore.addDocument(
        preparedDoc,
        preparedDoc.metadata.vector_id.toString()
      );
      return res;
    }
  } catch (error) {
    console.error("Error in ingestDoc:", error.message);
    throw error;
  }
};

module.exports = {
  ingestDocs,
  ingestDoc,
};
