const db = require("../db/queries");

async function deleteFolder(req, res) {
    try {
        console.log("deleting your folder...");
        await db.deleteFolder(parseInt(req.params.folderId));
        console.log("Your folder has been deleted");
        return res.status(201).redirect("/");
    }catch(error) {
        console.error(error);
        
        return res.status(500).render("errorPage", {
            user: req.user,
            messageError: "something went wrong during the deletion",
        });
    }
};

module.exports = {
    deleteFolder,
};

