// Model for the document db storing some of the metadata

import sequelize from "../../../config/sequelize";
import { DataTypes } from "sequelize";

const CompanyDocument = sequelize.define("Document", {
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

export default CompanyDocument;
