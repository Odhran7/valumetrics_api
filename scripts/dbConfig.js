import sequelize from "../config/sequelize";

sequelize.sync()
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
