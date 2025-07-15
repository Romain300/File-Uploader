const { Router } = require("express");
const { displayUploadPage, uploadFile } = require("../controllers/uploadFileController");
const { isAuth } = require("./authMiddleware");

const uploadFileRouter = Router();
uploadFileRouter.use(isAuth);
uploadFileRouter.get("/", displayUploadPage);
uploadFileRouter.post("/", uploadFile);

module.exports = uploadFileRouter;