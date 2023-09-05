// This is the config export for the financialModelling Api

const dotenv = require("dotenv");

module.exports = {
  financialModelingPrep: {
    hostname: "financialmodelingprep.com",
    port: 443,
    apiKey: process.env.FINANCIAL_MODELLING_PREP_API_KEY,
    endpoints: {
      earningsTranscriptList: "/api/v4/earning_call_transcript",
      earningsTranscript: "/api/v3/earning_call_transcript",
    },
  },
};
