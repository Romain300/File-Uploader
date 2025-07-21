const { Router } = require("express");
const { deleteFile } = require("../controllers/deleteFileController");

const deleteFileRouter = Router();
deleteFileRouter.get("/:fileId", deleteFile);

module.exports = deleteFileRouter;