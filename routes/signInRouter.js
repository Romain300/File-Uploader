const { Router } = require("express");
const { createUser } = require("../controllers/signInController");

const signInRouter = Router();

signInRouter.post("/", createUser);

module.exports = signInRouter;