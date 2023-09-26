// This util wipes the entire vector db -> ONLY USE IF YOU KNOW WHAT YOU ARE DOING

import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

// Setting the env variables

dotenv.config();

async function deleteIndex() {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME);
  indexDeleteResponse = pineconeIndex.delete1({
    deleteAll: true,
  });
  return indexDeleteResponse;
}

deleteIndex()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

export { deleteIndex };
