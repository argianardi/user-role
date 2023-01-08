let Sequelize = require("sequelize"); //import sequelize

// import nama database, username database, passwort database, dialect, host
let db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

// export database
module.exports = db;
