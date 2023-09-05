// This util given metadata splits the docs up

const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");

const createDocumentWithMetadataUtil = async (content, metadata) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  try {
    return await textSplitter.splitDocuments([
      new Document({ pageContent: content, metadata: metadata }),
    ]);
  } catch (error) {
    console.error(`Error creating document with metadata: ${error.message}`);
    return [];
  }
};

module.exports = createDocumentWithMetadataUtil;
