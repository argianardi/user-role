const controllers = {};

controllers.hello = async (req, res) => {
  res.json({ message: "hello controller" });
};

controllers.about = async (req, res) => {
  res.json({ message: "about controller" });
};

module.exports = controllers;
