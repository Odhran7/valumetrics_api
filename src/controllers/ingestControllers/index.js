// This aggregates the contoller logic and exports them

// GET /api/v1/ingest/

const { ingestServices } = require("../../services/index");
const { ingestTemplateController } = require("./ingestTemplateController");

// Create the controllers

// GET /api/v1/ingest/ticker=YOUR_TICKER_VALUE

const ingestController = require("./ingestController");

// GET /api/v1/ingest/8k/ticker=YOUR_TICKER_VALUE

const ingest8kController = ingestTemplateController(
  ingestServices.ingest8KDocsService,
  "8k"
);

// GET /api/v1/ingest/10k10q/ticker=YOUR_TICKER_VALUE

const ingest10k10qController = ingestTemplateController(
  ingestServices.ingest10K10QDocsService,
  "10k"
);

// GET /api/v1/ingest/13f/ticker=YOUR_TICKER_VALUE

const ingest13fController = ingestTemplateController(
  ingestServices.ingest13fQDocsService,
  "13f"
);

// GET /api/v1/ingest/earnings-transcripts/ticker=YOUR_TICKER_VALUE

const ingestEarningsTranscriptController = ingestTemplateController(
  ingestServices.ingestEarningsTranscriptDocsService,
  "earnings transcript"
);

// GET /api/v1/ingest/news/ticker=YOUR_TICKER_VALUE

const ingestNewsController = ingestTemplateController(
  ingestServices.ingestNewsService,
  "news"
);

// GET /api/v1/ingest/patents/ticker=YOUR_TICKER_VALUE

const ingestPatentsController = ingestTemplateController(
  ingestServices.ingestPatentsService,
  "patents"
);

module.exports = {
  ingestController,
  ingest8kController,
  ingest10k10qController,
  ingest13fController,
  ingestEarningsTranscriptController,
  ingestNewsController,
  ingestPatentsController,
};
