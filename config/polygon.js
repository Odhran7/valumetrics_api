// This is the config file for Polygon news service

const dotenv = require("dotenv");

module.exports = {
  polygon: {
    baseURL: "https://api.polygon.io",
    endpoints: {
      referenceNews: "/v2/reference/news",
    },
    apiKey: process.env.POLYGON_API_KEY,
    defaultLimit: 1000,
  },
};
