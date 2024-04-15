import db from "../db";
import Sequelize from "sequelize";

export default db.define("task", {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  priority: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  prazo: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});
