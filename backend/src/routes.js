const { Router } = require("express");

const DevContoller = require("./controllers/DevController");
const SearchContoller = require("./controllers/SearchContoller");

const routes = Router();

routes.get("/devs", DevContoller.index);
routes.post("/devs", DevContoller.store);

routes.get("/search", SearchContoller.index);

module.exports = routes;
