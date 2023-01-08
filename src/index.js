const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

//initialize express
const app = express();

// use package
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// server listening
const PORT = process.env.PORT || 6022;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
