const { Router } = require("express");
const { displayFolderUser } = require("../controllers/folderUserController");
const { updateFolder } = require("../controllers/updateFolderController");

const folderUserRoute =  Router();
folderUserRoute.get("/:folderName", displayFolderUser);
folderUserRoute.post("/:folderName", updateFolder);

module.exports = folderUserRoute;