// This config file is responsible for configuring Pinecone (vector database)

import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

// Setting the env variables

dotenv.config();

const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT;

if (!pineconeApiKey) {
  throw new Error("PINECONE_API_KEY is not set in the environment variables.");
}

const pineconeClient = new PineconeClient();

(async () => {
  try {
    await pineconeClient.init({
      apiKey: pineconeApiKey,
      environment: pineconeEnvironment,
    });
  } catch (error) {
    console.error("Error initializing Pinecone client:", error.message);
  }
})();

export { PineconeClient };
