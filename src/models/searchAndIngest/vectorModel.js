// Model for the vectors for storing the ids post-ingest

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const CompanyDocument = require('./companyDocumentModel');

const Vector = sequelize.define('Vector', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    document_id: DataTypes.INTEGER
});

module.exports = Vector;
