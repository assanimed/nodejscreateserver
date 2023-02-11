import { Sequelize } from "sequelize";

const sequelize = new Sequelize("storefront", "med", "med", {
  host: "localhost",
  dialect: "mysql",
  port: 3307,
});

export default sequelize;
