// This util retrieves an item from the appropriate dict and formats it before returning the docs

const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const rateLimitSecApiUtil = require('./rateLimitSecApiUtil');

const retrieveItemAndFormatUtil = async (
  link,
  items,
  document_id,
  ticker,
  type,
  year,
) => {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    let allDocumentsWithMetadata = [];

    for (const item of items) {
      const sectionText = await rateLimitSecApiUtil(
        link,
        item,
        "text"
      );
      const metadata = {
        id: document_id,
        ticker: ticker,
        type: type,
        item: item,
        year: year,
        link: link.link,
        txt: link.txt,
      };

      const docs = await textSplitter.splitDocuments([
        new Document({
          pageContent: sectionText,
          metadata: metadata,
        }),
      ]);

      allDocumentsWithMetadata.push(
        ...docs.map(
          (doc) =>
            new Document({
              metadata,
              pageContent: doc.pageContent,
            })
        )
      );
    }

    return allDocumentsWithMetadata;
  } catch (error) {
    console.error("Error in getItemTxtAndIngest:", error);
    throw new Error(
      `Failed to get and ingest item text for link ${
        link.link
      } and item ${items.join(", ")}: ${error.message}`
    );
  }
};

module.exports = retrieveItemAndFormatUtil;