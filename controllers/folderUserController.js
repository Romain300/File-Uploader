const db = require("../db/queries");

async function displayFolderUser(req, res) {
    try {
        const folder = await db.folderDetails(req.params.folderName, req.user.id);
        if (!folder) {
            return res.status(404).render("404notFound", { user: req.user });
        }
        return res.render("folderUser", { folder: folder, user: req.user });

    } catch(error) {
        console.error(error);
        return res.status(500).render("errorPage", {
                user: req.user,
                messageError: "something went wrong during folder fetching",
        });
    }
    
};

module.exports = {
    displayFolderUser,
};