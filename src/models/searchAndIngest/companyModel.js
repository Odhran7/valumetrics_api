// Model for the company data in the db

import { DataTypes } from "sequelize";
import sequelize from "../../../config/sequelize";

const Company = sequelize.define("company", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticker: DataTypes.STRING,
});

export default Company;
