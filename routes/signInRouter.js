const { Router } = require("express");
const { createUser, displaySignInPage } = require("../controllers/signInController");

const signInRouter = Router();

signInRouter.post("/", createUser);
signInRouter.get("/", displaySignInPage);

module.exports = signInRouter;