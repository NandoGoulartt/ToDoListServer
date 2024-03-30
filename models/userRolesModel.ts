import db from "../db";
import Sequelize from "sequelize";
import rolesModel from "./rolesModel";
import usersModel from "./usersModel";

export default db.define("user_role", {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  role_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: rolesModel,
      key: "id",
    },
  },
  user_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: usersModel,
      key: "id",
    },
  },
});
