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
            },
            include: {
                files: true
            },
        });
        return folders;
    }catch(error) {
        throw error;
    }
};

async function folderDetails(folderName, authorId) {
    try {
        const folder = await prisma.folder.findFirst({
            where: {
                name: folderName, 
                authorId: authorId
            },
            include: {
                author: {
                    select: {
                        name: true,
                    }
                },
                files: {
                    orderBy: {
                        uploadAt: "asc"
                    }
                }
            }
        });
        return folder
    }catch (error) {
        throw error;
    }
};

async function checkFolderName(folderName, userId) {
    try {
        const folderExist = await prisma.folder.findFirst({
            where: {
                name: folderName,
                authorId: userId
            }
        });
    
        return folderExist;
    } catch(error) {
        throw error;
    }
};

async function checkFileName(fileName, folderId, userId) {
    try {
        const folderExist = await prisma.file.findFirst({
            where: {
                name: fileName,
                folderId: folderId,
                authorId: userId
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
                authorId: authorId,
                resourceType: result.resource_type //for deletion and management
            }
        });

    }catch(error) {
        throw error;
    }

};

async function deleteFolder(folderId) {
    try {
        const files = await prisma.file.findMany({
            where: {
                folderId: folderId
            }
        });

        for (const file of files) {
            await deleteFile(file.id);
        }

        await prisma.folder.delete({
            where: {
                id: folderId,
            }
        });

    }catch (error) {
        throw error;
    }
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

async function updateFileName(fileId, name) {
    try {
        await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                name: name,
            }
        });

    }catch(error) {
        throw error;
    }
};

async function folderDetailsById(folderId) {
    try {
        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId
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
    deleteFile,
    updateFileName,
    folderDetailsById,
    checkFileName
};
