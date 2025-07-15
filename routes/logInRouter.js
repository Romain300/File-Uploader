const { Router } = require("express");
const { logInUser } = require("../controllers/logInController");

const logInRouter = Router();
logInRouter.post("/", logInUser);

module.exports = logInRouter;