const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    const users = await models.users.create({
      username: username,
      password: password,
    });
    res.status(201).json({
      message: "The user added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get all data request
controllerUsers.getAll = async (req, res) => {
  try {
    const users = await models.users.findAll();
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get one data request by id
controllerUsers.getOneById = async (req, res) => {
  try {
    const user = await models.users.findAll({
      where: { user_id: req.params.user_id },
    });

    if (user.length > 0) {
      res.status(200).json({
        message: "The user data is obtained",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "The User not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// export users controllers
module.exports = controllerUsers;
