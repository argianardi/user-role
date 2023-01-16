const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers
const validateAuth = require("../middlewares/validateAuth");

const auth = [validateAuth.isAuthenticated, validateAuth.isAdmin];

// post user
router.post("/", auth, controllers.users.post);

// get all users
router.get("/", validateAuth.isAuthenticated, controllers.users.getAll);

// get one user by id
router.get("/:id", validateAuth.isAuthenticated, controllers.users.getOneById);

// put user by id
router.put("/:id", auth, controllers.users.put);

// delete user by id
router.delete("/:id", auth, controllers.users.delete);

module.exports = router;
