const express = require('express');
const app = express();

// Middlewares, error handling, etc. can be set up here

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
