const { Router } = require("express");
const { deleteFolder } = require("../controllers/deleteFolderController");
const { isAuth } = require("./authMiddleware");

const deleteFolderRouter = Router();
deleteFolderRouter.use(isAuth);
deleteFolderRouter.get("/:folderId",deleteFolder);

module.exports = deleteFolderRouter;
