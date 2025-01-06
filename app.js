const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const pool = require('./db/pool')
const indexRouter = require('./routes/indexRouter');
const signUpRouter = require('./routes/signUpRouter')
const foldersFilesRouter = require('./routes/foldersFilesRouter')

const PORT = process.env.PORT || 3000;

app = express();

app.use(session({ secret: "unsecureExample", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    fs.mkdir("./users", { recursive: true }, (err) => {
        if (err) {
            console.error(err)
        }
    })
    fs.mkdir("./temp", { recursive: true }, (err) => {
        if (err) {
            console.error(err)
        }
    })
    next()
})

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
        const user = rows[0];
  
        if (!user) {
          return done(null, false);
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return done(null, false)
        }

        return done(null, user);
      } catch(err) {
          return done(err);
      }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    }
});

app.use(function (req, res, next) {
    res.locals.user = req.user
    next()
})

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use('/users/:userId', express.static('users'), (req, res, next) => {
  if (req.params.userId != req.user.id){
    return res.send("Access Denied")
  } else {
    return next()
  }
})
app.use('/users', express.static('users'));

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/folders-files", foldersFilesRouter);
app.use((err, req, res, next) => {
    if (err) {
        console.error("ERROR: ", err)
        res.send("Error: Pleaese try again later")
    }
})


app.listen(PORT, console.log(`File Uploader listening on port ${PORT}`))