const Sequelize = require("sequelize"); // import sequelize
const db = require("../database/database"); // import database

// Define method takes two arguments (name of table and columns inside the table)
const users = db.define("users", {
  // Column-1, user_id is an object with properties like type, keys, validation of column.
  id: {
    type: Sequelize.INTEGER, // Sequelize module has INTEGER data_type
    autoIncrement: true, // To increment user_id automatically
    allowNull: false, // user_id can not be null
    primaryKey: true, // for uniquely identify user
  },

  // Column-2, username
  username: {
    type: Sequelize.STRING(225),
    allowNull: false,
    unique: "username",
  },

  // Column-3, password
  password: { type: Sequelize.STRING(225), allowNull: false },

  // Timestamps
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// to execute alter table
db.sync({ alter: true })
  .then(() => {
    console.log("Table users created successfully!");
  })
  .catch((error) => {
    console.log("Unable to create table users:", error.message);
  });

// export table
module.exports = users;
