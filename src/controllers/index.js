const controllers = {}; //assign controllers (object of all controllers)
const users = require("./users"); //import users controllers

controllers.users = users; //assign users controllers to controllers

module.exports = controllers; //export controllers
