const { Router } = require('express');
const fs = require('fs');
const multer = require('multer');
const authenticateUser = require('../controllers/authenticateUser')
const db = require('../db/queries')

const upload = multer({ dest: 'uploads/' });
const foldersFilesRouter = Router();

foldersFilesRouter.post("/upload-file", upload.single("selectedFile"), async (req, res, next) => {
    fs.rename(req.file.path, req.file.destination + req.file.originalname, (err) => {
        if (err) {console.error(err)};
    });
    const folderId = await db.getFolderId(req.body.selectedFolder, req.user.id);
    await db.addFile(req.file.originalname, req.file.destination + req.file.originalname, new Date(), req.file.size, folderId.id, req.user.id);
    res.redirect("/");
})

foldersFilesRouter.post("/add-folder", async (req, res, next) => {
    // fs.mkdir(`./${req.body.newFolder}`, { recursive: true}, (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // MAY NOT NEED THE ABOVE CODE. WE CAN HAVE IT ALL IN ONCE FOLDER AND USE THE DB TO FILTER BY FOLDER ID 
    await db.addFolder(req.body.newFolder, req.user.id)
    res.redirect("/");
});

foldersFilesRouter.get("/folders", authenticateUser, async (req, res, next) => {
    const folders = await db.getFolders(req.user.id);
    res.render("folders", { user: req.user, folders: folders});
})

foldersFilesRouter.post("/update-folder", async (req, res, next) => {
    await db.updateFolder(req.body.oldFolderName.trim(), req.body.newFolderName.trim(), req.user.id)
    res.redirect("/folders-files/folders");
})

foldersFilesRouter.post("/delete-folder", async (req, res, next) => {
    await db.deleteFolder(req.body.deleteFolder, req.user.id);
    res.redirect("/folders-files/folders");
})

module.exports = foldersFilesRouter