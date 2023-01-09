const users = require("./users"); //import users controllers
const controllers = {}; //assign controllers (object of all controllers)

controllers.users = users; //assign users controllers to controllers

module.exports = controllers; //export controllers
