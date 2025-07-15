const db = require("../db/queries");

async function deleteFolder(req, res) {
    try {
        console.log("deleting your folder...");
        await db.deleteFolder(parseInt(req.params.folderId));
        console.log("Your folder has been deleted");
        return res.status(201).redirect("/");
    }catch(error) {
        console.error(error);
        res.send("soemthing went wrong during the deletion")
    }
};

module.exports = {
    deleteFolder,
};