import { Sequelize } from "sequelize";

const newSeq = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    port: 3306,
  }
);

newSeq
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
  });

export { newSeq };
