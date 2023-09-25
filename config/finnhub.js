// This util exports config for the finnhub client

const dotenv = require("dotenv");
const finnhub = require("finnhub");

dotenv.config();

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = process.env.FINN_HUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

module.exports = {
  finnhubClient,
};
