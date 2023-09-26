// This util exports config for the finnhub client

import dotenv from "dotenv";
import finnhub from "finnhub";

// Setting the env variables

dotenv.config();

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = process.env.FINN_HUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

export { finnhubClient };
