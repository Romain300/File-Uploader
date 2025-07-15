const db = require("../db/queries");

async function getIndexPage(req, res) {
    if (req.user) {
        const folders = await db.findUserFolders(req.user.id);
        return res.render("index", { folders: folders, user: req.user });
    } else {
        return res.render("index");
    }
};

module.exports = {
    getIndexPage,
};