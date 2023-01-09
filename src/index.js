const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const usersRoutes = require("./routes/users");

//initialize express
const app = express();

// use package
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/users", usersRoutes);

// server listening
const PORT = process.env.PORT || 6022;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
