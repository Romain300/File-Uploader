const db = require("../db/queries");

async function displayFolderUser(req, res) {
    const folder = await db.folderDetails(req.params.folderName);
    return res.render("folderUser", { folder: folder, user: req.user });
};

module.exports = {
    displayFolderUser,
};