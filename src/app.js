// Main application file

import { ingestRoutes } from "./routes/index";
import express from "express";

const app = express();
const PORT = 3000;

// GET /api/v1/ingest/

app.use('api/v1/ingest', ingestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
