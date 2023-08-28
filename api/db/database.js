import { Sequelize } from 'sequelize';

const Database = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

export default Database;