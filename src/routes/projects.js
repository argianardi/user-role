const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers
const validateAuth = require("../middlewares/validateAuth");

const auth = [validateAuth.isAuthenticated, validateAuth.isAdmin];

// post request
router.post("/", auth, controllers.projects.post);

// get request all data
router.get("/", validateAuth.isAuthenticated, controllers.projects.getAll);

// get request one data by id
router.get(
  "/:id",
  validateAuth.isAuthenticated,
  controllers.projects.getOneById
);

//  put request
router.put("/:id", auth, controllers.projects.put);

// delete request
router.delete("/:id", auth, controllers.projects.delete);

module.exports = router;
