import db from "../../db";
import rolesModel from "../../models/rolesModel";

async function seed() {
  try {
    db.sync().then(async () => {
      console.log("Conexão com o banco de dados estabelecida com sucesso.");

      await rolesModel.bulkCreate([
        {
          name: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "USUARIO",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      console.log("Dados iniciais inseridos com sucesso.");

      await db.close();
      console.log("Conexão com o banco de dados encerrada.");
    });
  } catch (error) {
    console.error("Erro durante a inserção de dados iniciais:", error);
  }
}

seed();
