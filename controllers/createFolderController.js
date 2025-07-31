const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

function displayCreateFolderPage(req, res) {
    return res.render("createFolder", { user: req.user })
};

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("folder's name cannot be empty")
];

const createFolder = [
    validateUser,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("createFolder", { 
                errors: errors.array(),
                user: req.user
            })
        }
        try {
            console.log("creating new folder...")
            const { name } = req.body;
            const authorId = req.user.id;
            const folderExist = await db.checkFolderName(name, authorId);
            if (folderExist) {
                return res.status(400).render("createFolder", {
                    user: req.user,
                    errors: [{ msg: "Folder's name already used"}]
                });
            }
            await db.createFolder(name, authorId);
            console.log(`folder ${name} has been created`);
            res.status(201).redirect("/");
        } catch(error) {
            console.error(error);
            res.status(500).send("something went wrong during folder creation")
        };
    }
];


module.exports = {
    createFolder,
    displayCreateFolderPage
};