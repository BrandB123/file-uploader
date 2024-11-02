const { Router } = require('express');
const fs = require('fs');
const multer = require('multer');
const authenticateUser = require('../controllers/authenticateUser')
const db = require('../db/queries')
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