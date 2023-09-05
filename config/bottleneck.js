const fs = require("fs");
const Bottleneck = require("bottleneck");

// Parse the config file

let rawConfig = fs.readFileSync("config.json");
let config = JSON.parse(rawConfig);

// Configure the limiter

const limiter = new Bottleneck({
  minTime: config.limiter.minTime,
});

// Export the limiter

module.exports = {
    limiter,
}
