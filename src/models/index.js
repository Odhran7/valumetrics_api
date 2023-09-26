// Main file for exporting the models

import Sequelize from "sequelize";
import sequelize from "../../config/sequelize";

// Import the models

const CompanyDocument = require("./searchAndIngest/companyDocumentModel");
const Company = require("./searchAndIngest/companyModel");
const Vector = require("./searchAndIngest/vectorModel");
const IngestAnalytic = require("./analytics/ingestAnalyticModel");

// Define the relationships

// Doc id with doc id in vectors

CompanyDocument.hasOne(Vector, {
  foreignKey: "document_id",
  onDelete: "CASCADE",
});

Vector.belongsTo(CompanyDocument, {
  foreignKey: "document_id",
  onDelete: "CASCADE",
});

// Company id in companies to doc

CompanyDocument.hasOne(Company, {
  foreignKey: "company_id",
  onDelete: "CASCADE",
});

Vector.belongsTo(CompanyDocument, {
  foreignKey: "company_id",
  onDelete: "CASCADE",
});

// Export the models

export {
  sequelize,
  Sequelize,
  CompanyDocument,
  Company,
  Vector,
  IngestAnalytic,
};
