// Model for the vectors for storing the ids post-ingest

import { DataTypes } from "sequelize";
import sequelize from "../../../config/sequelize";

const Vector = sequelize.define('Vector', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    document_id: DataTypes.INTEGER
});

export default Vector;
