// Main application file

const { ingestRoutes } = require('./routes/index');

const express = require("express");

const app = express();
const PORT = 3000;

// GET /api/v1/ingest/

app.use('api/v1/ingest', ingestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
