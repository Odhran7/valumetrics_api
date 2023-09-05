// This config file is responsible for configuring Pinecone (vector database

const { PineconeClient } = require("@pinecone-database/pinecone");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Pinecone client
const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT || "default"; // Assuming 'default' as a fallback environment

if (!pineconeApiKey) {
  throw new Error("PINECONE_API_KEY is not set in the environment variables.");
}

const pineconeClient = new PineconeClient();
pineconeClient.init({
  apiKey: pineconeApiKey,
  environment: pineconeEnvironment,
});

module.exports = {
  pineconeClient,
};
