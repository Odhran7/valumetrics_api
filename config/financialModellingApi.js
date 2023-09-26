// This is the config export for the financialModelling Api

import dotenv from "dotenv";

// Setting the env variables

dotenv.config();

// Config for financialmModellingPrep

const financialModelingPrep = {
  hostname: "financialmodelingprep.com",
  port: 443,
  apiKey: process.env.FINANCIAL_MODELLING_PREP_API_KEY,
  endpoints: {
    earningsTranscriptList: "/api/v4/earning_call_transcript",
    earningsTranscript: "/api/v3/earning_call_transcript",
  },
};

export { financialModelingPrep };
