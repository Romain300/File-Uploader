const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
];

const updateFileName = [
    validateUser,

    async (req, res) => {
        const errors = validationResult(req);
        const folderName = req.params.folderName;
        const fileId = parseInt(req.params.fileId);

        if (!errors.isEmpty()) {
            try {
                const folder = await db.folderDetails(folderName);
                return res.status(400).render("folderUser", { 
                    folder: folder, 
                    user: req.user,
                    errors: errors.array(),
                });

            }catch(error) {
                return res.status(500).send("something went wrong during update");
            }
        }

        try{
            const { name } = req.body;
            const folder = await db.folderDetails(folderName);
            const fileExist = await db.checkFileName(name, parseInt(folder.id), req.user.id);
            if (fileExist) {
                return res.status(400).render("folderUser", {
                    folder: folder,
                    user: req.user,
                    errors: [{ msg: "File's name already used"}]
                })
            }
            await db.updateFileName(fileId, name)
            return res.status(200).redirect(`/folder/${folderName}`)

        }catch(error) {
            console.error(error);
            return res.status(500).render("errorPage", {
                user: req.user,
                messageError: "something went wrong during update",
            });
        }

    }
];

module.exports = {
    updateFileName,
};