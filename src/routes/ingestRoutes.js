// Routes for // GET /api/v1/ingest/

const { ingestControllers } = require('../controllers/index');
const express = require('express');

const ingestRouter = express.Router();

// Routes 

router.get('/8k/:tickerValue', ingestControllers.ingest8kController);
router.get('/10k10q/:tickerValue', ingestControllers.ingest10k10qController);
router.get('/13f/:tickerValue', ingestControllers.ingest13fController);
router.get('/earnings-transcript/:tickerValue', ingestControllers.ingestEarningsTranscriptController);
router.get('/news/:tickerValue', ingestControllers.ingestNewsController);
router.get('/patents/:tickerValue', ingestControllers.ingestPatentsController);

module.exports = ingestRouter;