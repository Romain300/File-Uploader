const db = require("../db/queries");

async function sharedFolderDisplay(req, res) {
    const folder = await db.folderDetailsById(parseInt(req.params.folderId));
    if (!folder) {
        return res.status(404).render("404notFound", { user: req.user });
    }

    return res.render("sharedFolder", {
        folder: folder,
        user: req.user,
    });
};

module.exports = {
    sharedFolderDisplay,
};