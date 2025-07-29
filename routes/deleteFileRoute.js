const { Router } = require("express");
const { deleteFile } = require("../controllers/deleteFileController");
const { isAuth } = require("./authMiddleware");

const deleteFileRouter = Router();
deleteFileRouter.use(isAuth);
deleteFileRouter.get("/:fileId", deleteFile);

module.exports = deleteFileRouter;