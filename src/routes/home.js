const express = require("express");
const controllers = require("../controllers/index");
const router = express.Router();

router.get("/", controllers.home.hello);

router.get("/about", controllers.home.about);

module.exports = router;
