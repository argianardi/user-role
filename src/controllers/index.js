const controllers = {}; //assign controllers (object of all controllers)
const users = require("./users"); //import users controllers
const projects = require("./projects"); //import projects controllers

controllers.users = users; //assign users controllers to controllers
controllers.projects = projects; //assign projects controllers to controllers

module.exports = controllers; //export controllers
