const controllers = {}; //assign controllers (object of all controllers)
const users = require("./users"); //import users controllers
const projects = require("./projects"); //import projects controllers
const auth = require("./auth");

controllers.users = users; //assign users controllers to controllers
controllers.projects = projects; //assign projects controllers to controllers
controllers.auth = auth;

module.exports = controllers; //export controllers
