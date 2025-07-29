const db = require("../db/queries");

async function displayFolderUser(req, res) {
    const folder = await db.folderDetails(req.params.folderName);

    if (!folder) {
        return res.status(404).render("404notFound", { user: req.user });
    }
    
    return res.render("folderUser", { folder: folder, user: req.user });
};

module.exports = {
    displayFolderUser,
};