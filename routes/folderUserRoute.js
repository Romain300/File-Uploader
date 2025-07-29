const { Router } = require("express");
const { displayFolderUser } = require("../controllers/folderUserController");
const { updateFolder } = require("../controllers/updateFolderController");
const { updateFileName } = require("../controllers/updateFileController");
const { isAuth } = require("./authMiddleware");

const folderUserRoute =  Router();
folderUserRoute.use(isAuth);
folderUserRoute.get("/:folderName", displayFolderUser);
folderUserRoute.post("/:folderName", updateFolder);
folderUserRoute.post("/:folderName/:fileId", updateFileName);

module.exports = folderUserRoute;