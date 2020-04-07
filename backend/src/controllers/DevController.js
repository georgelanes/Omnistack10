const api = require("../services/api");
const Dev = require("../models/Dev");
const { findConnections, sendMessage } = require("../websocket");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    const devExiste = await Dev.findOne({ github_username });
    if (devExiste) {
      return res
        .status(401)
        .json({ message: "Usuário já existe!", type: "Error" });
    }

    const response = await api.get(
      `https://api.github.com/users/${github_username}`
    );

    const { name = login, avatar_url, bio } = response.data;

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    const techsArray = parseStringAsArray(techs);

    const dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });

    const sendMessageTo = findConnections({ longitude, latitude }, techsArray);

    sendMessage(sendMessageTo, "new-dev", dev);

    return res.json(dev);
  }
};
