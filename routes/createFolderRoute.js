const { Router } = require("express");
const { createFolder, displayCreateFolderPage } = require("../controllers/createFolderController");
const { isAuth } = require("./authMiddleware");

const createFolderRoute = Router();
createFolderRoute.use(isAuth);
createFolderRoute.get("/", displayCreateFolderPage);
createFolderRoute.post("/", createFolder);

module.exports = createFolderRoute;