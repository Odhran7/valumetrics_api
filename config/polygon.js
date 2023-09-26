// This is the config file for Polygon news service

import dotenv from "dotenv";

// Setting the env variables

dotenv.config();

const polygonConfig = {
  polygon: {
    baseURL: "https://api.polygon.io",
    endpoints: {
      referenceNews: "/v2/reference/news",
    },
    apiKey: process.env.POLYGON_API_KEY,
    defaultLimit: 1000,
  },
};

export { polygonConfig };
