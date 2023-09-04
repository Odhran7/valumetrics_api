// Analytics for time to ingest

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const IngestAnalytic = sequelize.define('IngestAnalytics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticker: {
        type: DataTypes.STRING,
        unique: true,  // if you want to ensure tickers are unique
    },
    time_to_ingest: DataTypes.TIME,
});

module.exports = IngestAnalytic;
