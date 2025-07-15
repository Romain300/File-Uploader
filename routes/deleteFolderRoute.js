const { Router } = require("express");
const { deleteFolder } = require("../controllers/deleteFolderController");

const deleteFolderRouter = Router();
deleteFolderRouter.get("/:folderId",deleteFolder);

module.exports = deleteFolderRouter;
