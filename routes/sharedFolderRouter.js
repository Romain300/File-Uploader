const { Router } = require("express");
const { sharedFolderDisplay, createShareLink} = require('../controllers/sharedFolderController');
const { isAuth } = require("./authMiddleware");

const sharedFolderRouter = Router();
sharedFolderRouter.get("/:token", sharedFolderDisplay);
sharedFolderRouter.post("/:folderId/link", isAuth, createShareLink);

module.exports = sharedFolderRouter;