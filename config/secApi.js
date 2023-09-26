// This is the config file for the sec-api interface

import dotenv from "dotenv";
import { queryApi, extractorApi } from "sec-api";

dotenv.config();

// Set the api key

extractorApi.setApiKey(process.env.SEC_API_KEY);
queryApi.setApiKey(process.env.SEC_API_KEY);

// Export the configuration

export { extractorApi, queryApi };
