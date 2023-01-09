const Sequelize = require("sequelize"); //import sequelize

// import nama database, username database, passwort database, dialect, host
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

db.authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error.message);
  });

// export database
module.exports = db;
