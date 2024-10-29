const express = require('express');

const PORT = process.env.PORT || 3000;

app = express();

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.listen(PORT, console.log(`File Uploader listening on port ${PORT}`))