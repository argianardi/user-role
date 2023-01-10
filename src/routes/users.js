const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

// get all users
router.get("/", controllers.users.getAll);

// get one user by id
router.get("/:user_id", controllers.users.getOneById);

// put user by id
router.put("/:user_id", controllers.users.put);

// delete user by id
router.delete("/:user_id", controllers.users.delete);

module.exports = router;
