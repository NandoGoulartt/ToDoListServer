import { Sequelize } from "sequelize";
import rolesModel from "../../models/rolesModel";
import tasksModel from "../../models/tasksModel";
import userRolesModel from "../../models/userRolesModel";
import usersModel from "../../models/usersModel";

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`,
  {
    logging: false,
  }
);

async function createSchema() {
  try {
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    await sequelize.query(`${process.env.DB_NAME}`);

    console.log("Schema criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o schema:", error);
  }
}

createSchema().then(async () => {
  await createTables();
});

async function createTables() {
  try {
    await rolesModel.sync();
    await usersModel.sync();
    await userRolesModel.sync();
    await tasksModel.sync();

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar as tabelas:", error);
  }
}
