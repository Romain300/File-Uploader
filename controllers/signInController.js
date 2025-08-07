const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

function displaySignInPage(req, res) {
    return res.render("signIn");
};

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email must be valid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password cannot be empty"),
    body("cpassword")
        .trim()
        .notEmpty()
        .withMessage("confirm password cannot be empty")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password and Confirm password must match");
            }

            return true;
        })
];


const createUser = [
    validateUser,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("signIn", { errors: errors.array() });
        }

        try {
            console.log("creating new user");
            const { name, email } = req.body;
            const userExist = await db.getUserByEmail(email);
            if (userExist) {
                return res.status(400).render("signIn", {
                    errors: [{msg: "Email already used"}]
                });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.createUser(name, email, hashedPassword);
            const user = await db.getUserByEmail(email);
            console.log("User has been created");
            console.log(user);
            return res.status(201).redirect("/");
        } catch(error) {
            console.error(error);

            return res.status(500).render("errorPage", {
                user: req.user,
                messageError: "something went wrong during user creation",
            });
        }

    }
];

module.exports = {
    createUser,
    displaySignInPage
};

