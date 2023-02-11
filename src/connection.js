import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_TYPE, // mysql | postgresql | mariadb
    port: process.env.DB_PORT || 3306,
  }
);

export default sequelize;
