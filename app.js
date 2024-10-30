const express = require('express');

const PORT = process.env.PORT || 3000;

const pool = require('./db/pool')

app = express();

app.get("/", async (req, res) => {
    // await pool.query(`INSERT INTO users (name, password_hash, email)
    //                   VALUES ('Brandon Bartlet', 'testing', 'email@email.com')`)
    res.send("Check the DB");
})

app.listen(PORT, console.log(`File Uploader listening on port ${PORT}`))