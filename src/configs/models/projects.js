const Sequelize = require("sequelize");
const db = require("../database/database");

const projects = db.define("projects", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

db.sync({ alter: true, force: false })
  .then(() => {
    console.log("Projects table create successfully");
  })
  .catch((error) => {
    console.log("Unable to create table projects:", error.message);
  });

module.exports = projects;
