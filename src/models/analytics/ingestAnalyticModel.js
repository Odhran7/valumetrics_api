// Analytics for time to ingest

import { DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize';

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

export default IngestAnalytic
