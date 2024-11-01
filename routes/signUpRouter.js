const { Router } = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/queries')

const signUpRouter = Router();

signUpRouter.get("/", async (req, res) => {
    if (req.user){
        res.redirect("/")
    } else {
        res.render("sign-up");
    }
})

signUpRouter.post("/", async (req, res, next) => {
    const name = `${req.body.firstName} ${req.body.lastName}`;
    if (req.body.password !== req.body.passwordConfirmation){
        res.redirect("/sign-up")
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            try {
                db.addUser(name, hashedPassword, req.body.username)
            } catch (err) {
                return next(err)
            }
        });
        res.redirect("/");
    }
})

module.exports = signUpRouter