const models = {}; //assign models
const users = require("./users"); //import users
const projects = require("./projects"); //import projects

models.users = users; //assign users
models.projects = projects; //assign projects

module.exports = models; //export models
