// This util given metadata splits the docs up

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

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

export default createDocumentWithMetadataUtil;
