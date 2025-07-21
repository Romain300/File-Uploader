const prisma = require("./client");
const cloudinary = require("cloudinary").v2;

async function createUser(name, email, password) {
    try {
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
            },
        });

    }catch(error) {
        console.error(error);
        throw error;
    }
};

async function getUserByEmail(email) {
    try{
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    
        return user;

    }catch (error) {
        console.error(error);
        throw error;
    }
};

async function getUserById(userId) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
        });

        return user;

    }catch(error) {
        throw error;
    }
};

async function createFolder(name, authorId) {
    try {
        await prisma.folder.create({
            data: {
                name: name,
                authorId: authorId
            }
        });
    }catch(error) {
        throw error;
    }
};

async function findUserFolders(userId) {
    try {
        const folders = await prisma.folder.findMany({
            where: {
                authorId: userId
            }
        });
        return folders;
    }catch(error) {
        throw error;
    }
};

async function folderDetails(folderName) {
    try {
        const folder = await prisma.folder.findUnique({
            where: {
                name: folderName
            },
            include: {
                author: {
                    select: {
                        name: true,
                    }
                },
                files: true,
            }
        });
        return folder
    }catch (error) {
        throw error;
    }
};

async function deleteFolder(folderId) {
    try {
        await prisma.folder.delete({
            where: {
                id: folderId,
            }
        });

    }catch (error) {
        throw error;
    }
};

async function checkFolderName(name) {
    try {
        const folderExist = await prisma.folder.findUnique({
            where: {
                name: name
            }
        });
    
        return folderExist;
    } catch(error) {
        throw error;
    }
};

async function updateFolderName(folderId, name) {
    try {
        await prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                name: name,
            }
        });

    }catch(error) {
        throw error;
    }
};

async function uploadFile(file, fileName, folderId, authorId) {
    try {

        const result = await new Promise((resolve, reject) => {

            cloudinary.uploader.upload_stream(
                {resource_type: "auto"},
                (error, result) => {
                    if (error) return reject(error);
                    return resolve(result);
                }
            ).end(file.buffer);

        });
        
        console.log(result);

        let url;

        if (result.resource_type === "image") {
            url = cloudinary.url(result.public_id, {
                transformation: [
                    {
                        quality: "auto",
                        fetch_format: "auto"
                    },
                    {
                        width: 1200,
                        height: 1200,
                        crop: "fill",
                        gravity: "auto"
                    }
                ]
                
            });
        } else {
            url = result.secure_url;
        }
            
        await prisma.file.create({
            data: {
                name:fileName,
                url: url,
                public_id: result.public_id, //for futur management
                folderId: folderId,
                authorId: authorId
            }
        });

    }catch(error) {
        throw error;
    }

    //don t forget to store ressource-type for future deletion 
};

async function deleteFile(fileId) {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileId
            }
        });

        const result = await cloudinary.uploader.destroy(file.public_id, { resource_type: "raw" });
        if (result.result !== "ok" && result.result ==="not found") {
            throw new Error("Failed to delete file from cloudinary: " + result.result);
        }

        await prisma.file.delete({
            where: {
                id: fileId
            }
        });

    } catch(error) {
        throw error;
    }
};



module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    createFolder,
    findUserFolders,
    folderDetails,
    deleteFolder,
    checkFolderName,
    updateFolderName,
    uploadFile,
    deleteFile
};