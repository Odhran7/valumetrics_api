// Model for the document db storing some of the metadata

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const Vector = require('./vectors');

const CompanyDocument = sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    company_id: DataTypes.INTEGER,
    document_type: DataTypes.STRING,
    year: DataTypes.INTEGER,
    upload_timestamp: DataTypes.DATE,
    link: DataTypes.STRING,
    month: DataTypes.INTEGER,
});


module.exports = CompanyDocument;