const { Router } = require('express');
const passport = require('passport');

const indexRouter = Router()

indexRouter.get("/", (req, res, next) => {
    res.render("index", { user: req.user });
})

indexRouter.post(     
    "/sign-in", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
)

module.exports = indexRouter