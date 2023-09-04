// Model for the company data in the db

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const Company = sequelize.define('company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticker: DataTypes.STRING,
});

module.exports = Company;