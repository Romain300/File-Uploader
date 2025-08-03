const { Router } = require("express");
const { sharedFolderDisplay } = require('../controllers/sharedFolderController');

const sharedFolderRouter = Router();
sharedFolderRouter.get("/:folderId", sharedFolderDisplay);

module.exports = sharedFolderRouter;