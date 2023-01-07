const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const homeRoutes = require("./routes/home");

const app = express();

const PORT = process.env.PORT || 5022;

// use package
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route
app.use("/home", homeRoutes);

// server listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
