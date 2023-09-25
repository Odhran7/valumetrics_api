// This config file is for the limiter to the api

const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
  minTime: 110
});

module.exports = {
  limiter,
};
