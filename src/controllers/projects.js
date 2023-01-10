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

// get request one data by id
controllerProjects.getOneById = async (req, res) => {
  try {
    const project = await models.projects.findAll({
      where: { id: req.params.id },
    });

    if (project.length > 0) {
      res.status(200).json({
        message: "The project data is obtained",
        data: project,
      });
    } else {
      res.status(200).json({
        message: "The project not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// put request
controllerProjects.put = async (req, res) => {
  //body request
  const { title, description } = req.body;

  // check the body req if nill return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  try {
    const project = await models.projects.update(
      {
        title: title,
        description: description,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "The project data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//delete request
controllerProjects.delete = async (req, res) => {
  try {
    const project = await models.projects.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "The project data deleted successfully",
    });
  } catch (error) {
    res.status(200).json({
      message: error.message,
    });
  }
};

module.exports = controllerProjects;
