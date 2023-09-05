// Service will be used to handle ingestion of data analytics

const { IngestAnalytic } = require("../../../models")

// This function creates an ingest time analytics

const createIngestAnalytic = async (data) => {
    try {
        const analytic = await IngestAnalytic.create(data);
        return analytic;
    } catch (error) {
        console.log("There was an error adding the ingest analytic to the database");
        throw new Error();
    }
}

// Get an analytic by an id

const getAnalyticById = async (id) => {
    try {
        const analytic = await IngestAnalytic.findByPk(id);
        return analytic;
    } catch (error) {
        console.log("There was an error getting the ingest analytic by id");
        throw new Error();
    }
}

// Get an analytic by ticker

const getAnalyticByTicker = async (ticker) => {
    try {
        const analytic = IngestAnalytic.findAll({
            where: {
                ticker: ticker,
            }
        });
        return analytic;
    } catch (error) {
        console.log("There was an error getting the ingest analytic by ticker");
        throw new Error();
    }
}

// Exporting the modules

module.exports = {
    createIngestAnalytic,
    getAnalyticById,
    getAnalyticByTicker,
}