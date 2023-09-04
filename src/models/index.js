// Main file for exporting the models

const { Sequelize } = require("sequelize");
const sequelize = require("../../config/sequelize");

// Import the models

const CompanyDocument = require("./searchAndIngest/documents");
const Company = require("./searchAndIngest/company");
const Vector = require("./searchAndIngest/vectors");
const IngestAnalytic = require("./analytics/ingestAnalytics");

// Define the relationships

CompanyDocument.hasOne(Vector, {
  foreignKey: "document_id",
  onDelete: "CASCADE",
});

Vector.belongsTo(CompanyDocument, {
  foreignKey: "document_id",
  onDelete: "CASCADE",
});

// Export the models

module.exports = {
  sequelize,
  Sequelize,
  CompanyDocument,
  Company,
  Vector,
  IngestAnalytic,
};
