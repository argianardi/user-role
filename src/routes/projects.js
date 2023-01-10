const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

// get request all data
router.get("/", controllers.projects.getAll);

// get request one data by id
router.get("/:id", controllers.projects.getOneById);

module.exports = router;
