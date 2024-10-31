const { Router } = require('express');
const passport = require('passport');
const db = require('../db/queries');

const indexRouter = Router()

indexRouter.get("/", async (req, res, next) => {
    const files = await db.getFiles();
    console.log(files)
    const folders = await db.getFolders();
    res.render("index", { user: req.user, files: files, folders: folders});
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