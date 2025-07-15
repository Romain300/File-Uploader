const { body, validationResult } = require("express-validator");
const passport = require("passport");

const validateUser = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Emaail cannot be empty"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password cannot be empty")
];

const logInUser = [
    validateUser,

    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render("index", { errors: errors.array() });
        }

        return passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/"
        })(req, res, next)
    }
];

module.exports = {
    logInUser,
};