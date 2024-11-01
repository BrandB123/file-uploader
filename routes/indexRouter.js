const { Router } = require('express');
const passport = require('passport');
const fs = require('fs');
const db = require('../db/queries');

const indexRouter = Router()

indexRouter.get("/", async (req, res, next) => {
    if (req.user){
        fs.mkdir("./uploads", { recursive: true}, (err) => {
            if (err) {
                console.error(err);
            }
        });
        db.addFolder("Uploads", req.user.id)
        const files = await db.getFiles(req.user.id);
        // console.log(files)
        const folders = await db.getFolders(req.user.id);
        res.render("index", { user: req.user, files: files, folders: folders});
    } else {
        res.render("index", { user: req.user, files: [], folders: []});
    }
})

indexRouter.post(     
    "/sign-in", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
)

indexRouter.get("/sign-out", function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/")
    });
});

module.exports = indexRouter