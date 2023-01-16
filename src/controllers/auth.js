const models = require("../configs/models/index"); //import model
const controllersAuth = {}; //assign users controllers
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

controllersAuth.login = async (req, res) => {
  // assign reques body
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  try {
    const user = await models.users.findAll({
      where: { email },
    });
    if (user.length > 0) {
      const comparePassword = bcrypt.compareSync(password, user[0].password);
      if (comparePassword) {
        const secret = process.env.JWT_SECRET_KEY || "secret";
        const token = jwt.sign({ id: user[0].id, role: user[0].role }, secret, {
          expiresIn: "2h",
        });

        if (token) {
          res.status(200).json({
            success: true,
            message: "Login success",
            data: {
              token: token,
              username: user[0].username,
              email: user[0].email,
              role: user[0].role,
            },
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "Password doesn't match",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "The User not registered!!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "500 internet server error",
    });
  }
};

controllersAuth.register = async (req, res) => {
  const { username, password, email, role } = req.body;
  if (!(username && password && email && role)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  const users = await models.users.findAll({
    where: { email },
  });
  console.log(users);
  if (users.length > 0) {
    return res
      .status(201)
      .json({ message: "The email is already registered!!" });
  } else {
    // bcrypt
    const salt = bcrypt.genSaltSync(10);
    const passwordHashed = await bcrypt.hashSync(password, salt);

    // post request use sequelizes
    try {
      const users = await models.users.create({
        username,
        password: passwordHashed,
        email,
        role,
      });
      res.status(201).json({
        message: "The user added successfully",
      });
    } catch (error) {
      res.status(404).json({
        message: error.message,
      });
    }
  }
};

module.exports = controllersAuth;
