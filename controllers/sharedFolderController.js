const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function sharedFolderDisplay(req, res) {
    const token = req.params.token;
    const shareLink = await db.getShareLink(token);
    if (!shareLink) {
        return res.status(404).render("404notFound", { user: req.user });
    }
    const shareLinkIsRevoked = await db.shareLinkIsRevoked(shareLink);
    const folder = shareLink.folder;
    if (!folder || shareLinkIsRevoked) {
        return res.status(404).render("404notFound", { user: req.user });
    }

    const expiresAt = shareLink.expiresAt;
    return res.render("sharedFolder", {
        folder: folder,
        user: req.user,
        expiresAt: expiresAt
    });
};

const validateUser = [
    body("duration")
        .trim()
        .notEmpty()
        .withMessage("Duration cannot be empty")
        .custom((value) => {
            const intVal = parseInt(value, 10);
            if (!Number.isInteger(intVal) || intVal <= 0) {
                throw new Error("Duration must be a positive number")
            }

            return true;
        })
];

const createShareLink = [
    validateUser,

    async (req, res) => {
        const errors = validationResult(req);
        const folderName = req.params.folderName;
        if (!errors.isEmpty()) {
            try {
                const folder = await db.folderDetails(folderName);
                return res.status(400).render("folderUser", { 
                    errors: errors.array(), 
                    folder: folder,
                    user: req.user
                });
            } catch(error) {
                
                return res.status(500).render("errorPage", {
                    user: req.user,
                    messageError: "something went wrong during update",
                });
            }
        }

        try {
            console.log("creating shareLink...");
            const { duration } = req.body;
            const share = await db.createShareLink(parseInt(req.params.folderId), parseInt(duration));
            const fullLink = `${req.protocol}://${req.get('host')}/share/${share.token}`;

            return res.status(200).render("shareLink", {
                user: req.user,
                link: fullLink
            })

        } catch(error) {
            console.error(error);
            
            return res.status(500).render("errorPage", {
                user: req.user,
                messageError: "something went wrong during link creation",
            });
        }
    }
]

module.exports = {
    sharedFolderDisplay,
    createShareLink
};