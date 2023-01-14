const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

// get request all data
router.get("/", controllers.projects.getAll);

// get request one data by id
router.get("/:id", controllers.projects.getOneById);

//  put request
router.put("/:id", controllers.projects.put);

// delete request
router.delete("/:id", controllers.projects.delete);

module.exports = router;
