const db = require("../db/queries");

async function deleteFile(req, res) {
    try {
        console.log("deleting your file...");
        const fileId = req.params.fileId;
        await db.deleteFile(parseInt(fileId));
        console.log("Your file has been deleted");
        return res.status(200).redirect("/");

    } catch(error) {
        console.error(error);
        return res.status(500).send("something went wrong during the deletion");
    }
};

module.exports = {
    deleteFile,
};
