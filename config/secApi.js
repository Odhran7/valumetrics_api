// This is the config file for the sec-api interface

const dotenv = require('dotenv');
const { queryApi, extractorApi } = require('sec-api');

dotenv.config();

// Set the api key

extractorApi.setApiKey(process.env.SEC_API_KEY);
queryApi.setApiKey(process.env.SEC_API_KEY);

// Export the configuration

module.exports = {
    extractorApi,
    queryApi,
}