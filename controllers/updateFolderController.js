const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
];

const updateFolder = [
    validateUser,

    async (req,res) => {
        const errors = validationResult(req);
        const { name } = req.body;
        const currentName = req.params.folderName;
        if (!errors.isEmpty()) {
            try {
                const folder = await db.folderDetails(currentName);
                return res.status(400).render("folderUser", { 
                    errors: errors.array(), 
                    folder: folder,
                    user: req.user
                });
            } catch(error) {
                return res.status(500).send("something went wrong during update");
            }
        }
        try {
            const folderId = parseInt(req.body.folderId);
            const folderExist = await db.checkFolderName(name, req.user.id);
            if (folderExist) {
                try {
                    const folder = await db.folderDetails(currentName);
                    return res.status(400).render("folderUser", { 
                        errors: [{ msg: "Name already used " }], 
                        folder: folder 
                    });
                } catch(error) {
                    return res.status(500).send("something went wrong during update");
                }
            }
            await db.updateFolderName(folderId, name);
            return res.status(200).redirect(`/folder/${name}`);
        }catch (error) {
            console.error(error);
            return res.status(500).send("something went wrong during update");
        }
    }
];

module.exports = {
    updateFolder,
};
    


