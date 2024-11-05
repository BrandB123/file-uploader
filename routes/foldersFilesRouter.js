const { Router } = require('express');
const fs = require('fs');
const multer = require('multer');
const authenticateUser = require('../controllers/authenticateUser')
const db = require('../db/queries');
const bcrypt = require('bcryptjs')
const temp = multer({ dest: 'temp/' });

const foldersFilesRouter = Router();

// FILE INTERACTIONS
foldersFilesRouter.post("/upload-file", 
    temp.single("selectedFile"),
    async (req, res, next) => {
        fs.rename(req.file.path, `users/${req.user.id}/${req.body.selectedFolder}/${req.file.originalname}`, (err) => {
            if (err) {
                console.error(err)
            };
        })
        const folderId = await db.getFolderId(req.body.selectedFolder, req.user.id);
        await db.addFile(
            req.file.originalname, 
            `users/${req.user.id}/${req.body.selectedFolder}/${req.file.originalname}`, 
            new Date(), 
            req.file.size, 
            folderId, 
            req.user.id
        );
        res.redirect("/");
    }
)

foldersFilesRouter.get("/files/:fileName", authenticateUser, async (req, res, next) => {
    const file = await db.getFile(req.params.fileName, req.user.id)
    res.render("file", { user:req.user, file: file[0]})
})

foldersFilesRouter.post("/files/delete", async (req, res, next) => {
    const pathArray = req.body.deleteFile.split("/")
    fs.rm(`${req.body.deleteFile}`, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
        }
    });
    await db.deleteFile(pathArray[3], req.user.id);
    res.redirect("/");
})

foldersFilesRouter.post("/files/download", async (req, res, next) => {
    res.download(`${req.body.downloadFile}`, (err) => {
        if (err) {
            console.error(err);
        }
    });
})

foldersFilesRouter.post("/files/share", async (req, res, next) => {
    const pathArray = req.body.shareFile.split("/")
    bcrypt.hash(pathArray[3], 3, async (err, hashedName) => {
        if (err) {
            return next(err);
        }
        try {
            const shareId = hashedName.replaceAll("/", "-")
            db.shareFile(pathArray[3], req.user.id, shareId, req.body.shareExp)
        } catch (err) {
            return next(err)
        }
        res.redirect("/");
    });
})


foldersFilesRouter.get("/shared/:userId/:sharedId", async (req, res, next) => {
    const file = await db.getSharedFile(req.params.sharedId, req.params.userId)
    const today = new Date();
    let expiration;
    if (file[0]){
        expiration = new Date(file[0].share_end_date)
    }
    if (!file[0]){
        res.send("No file found")
    } else if (expiration < today){
        res.send("File no longer available")
    } else {
        res.render("sharedFile", { file: file[0]})
    }
})

foldersFilesRouter.post("/shared/download", async (req, res, next) => {
    res.download(`${req.body.downloadSharedFile}`, (err) => {
        if (err) {
            console.error(err);
        }
    });
})

// FOLDER INTERACTIONS
foldersFilesRouter.get("/folders", authenticateUser, async (req, res, next) => {
    const folders = await db.getFolders(req.user.id);
    res.render("folders", { user: req.user, folders: folders});
})

foldersFilesRouter.post("/add-folder", async (req, res, next) => {
    fs.mkdir(`./users/${req.user.id}/${req.body.newFolder}`, { recursive: true}, (err) => {
        if (err) {
            console.error(err);
        }
    });
    await db.addFolder(req.body.newFolder, req.user.id)
    res.redirect("/");
});

foldersFilesRouter.post("/update-folder", async (req, res, next) => {
    fs.rename(`users/${req.user.id}/${req.body.oldFolderName.trim()}`, `users/${req.user.id}/${req.body.newFolderName.trim()}`, (err) => {
        if (err) {
            console.error(err)
        };
    })
    await db.updateFolder(req.body.oldFolderName.trim(), req.body.newFolderName.trim(), req.user.id)
    res.redirect("/folders-files/folders");
})

foldersFilesRouter.post("/delete-folder", async (req, res, next) => {
    fs.rm(`users/${req.user.id}/${req.body.deleteFolder}`, { recursive: true }, (err) => {
        if (err) {
            console.error(err)
        };
    })
    const folderId = await db.getFolderId(req.body.deleteFolder, req.user.id);
    await db.deleteFiles(req.user.id, folderId);
    await db.deleteFolder(req.body.deleteFolder, req.user.id);
    res.redirect("/folders-files/folders");
})

module.exports = foldersFilesRouter