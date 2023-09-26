// This config file is for the limiter to the api

import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  minTime: 110,
});

export { limiter };
