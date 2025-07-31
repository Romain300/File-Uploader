const multer = require("multer");
const path = require("path");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function displayUploadPage(req, res){
    const folders = await db.findUserFolders(req.user.id);
    return res.render("uploadFile", { 
        folders: folders,
        user: req.user
    });
};

const validateUser = [
    body('fileName')
        .trim()
        .notEmpty()
        .withMessage("name cannot be empty"),
    body('folderId')
        .trim()
        .notEmpty()
        .withMessage("folder cannot be empty"),
];

function fileValidation(req) {
    if (!req.file) {
        return {msg: "file cannot be empty"}
    }
};

const upload = multer();

const uploadFile = [
    upload.single("file"),

    validateUser,

    async (req, res) => {
        const errors = validationResult(req).array();
        const fileCheck = fileValidation(req);
        if (fileCheck) {
            errors.push(fileCheck);
        }
        if (errors.length > 0) {
            const folders = await db.findUserFolders(req.user.id);
            return res.render("uploadFile", { 
                folders: folders,
                errors: errors,
                user: req.user
            });
        }
        const file = req.file;
        const { fileName, folderId } = req.body;
        const authorId = req.user.id;
        try {
            const fileExist = await db.checkFileName(fileName, parseInt(folderId), req.user.id);
            if (fileExist) {
                const folders = await db.findUserFolders(req.user.id);
                return res.status(400).render("uploadFile", {
                    folders: folders,
                    user: req.user,
                    errors: [{ msg: "File's name already used"}]
                })
            }
            await db.uploadFile(file, fileName, parseInt(folderId), authorId);
            return res.status(200).redirect("/");

        }catch(error) {
            console.log(error);
            res.status(500).send("something went wrong during file upload")
        }
        
    }
];


module.exports = {
    displayUploadPage,
    uploadFile,
}