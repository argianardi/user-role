const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

// get all users
router.get("/", controllers.users.getAll);

// get one user by id
router.get("/:user_id", controllers.users.getOneById);

module.exports = router;
