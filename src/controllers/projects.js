const models = require("../configs/models/index"); //import model
const controllerProjects = {}; //assign projects controllers (objec of all projects controllers)

// post request
controllerProjects.post = async (req, res) => {
  // assign request body
  const { title, description } = req.body;

  // check if req.body is null return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelize
  try {
    const project = await models.projects.create({
      title: title,
      description: description,
    });
    res.status(201).json({
      message: "The project added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get all data
controllerProjects.getAll = async (req, res) => {
  try {
    const projects = await models.projects.findAll();
    if (projects.length > 0) {
      res.status(200).json({
        message: "All projects data are obtained",
        data: projects,
      });
    } else {
      res.status(200).json({
        message: "Projects not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = controllerProjects;
