const pool = require('./pool')

async function addUser(name, hashedPassword, username){
    try {
        await pool.query(`INSERT INTO users (name, password_hash, email)
            VALUES ($1, $2, $3)`, [name, hashedPassword, username])
        console.log("User added to database.")
    } catch (err){
        console.error("Error adding user to database: ", err)
    }
}

async function getFolders(){
    try{
        const { rows } = await pool.query(`SELECT * FROM folders`)
        return rows;
    } catch(err){
        console.error("Error getting folder data: ", err)
    }
}

async function getFolderId(name){
    const { rows } = await pool.query(`SELECT id FROM folders WHERE name = $1`, [name]);
    return rows;
}

async function addFolder(name) {
    try {
        await pool.query(`INSERT INTO folders(name) VALUES ($1)`, [name])
        console.log("Folder added to database.")
    } catch (err){
        console.error("Error adding new folder: ", err)
    }
}

async function getFiles() {
    try{
        const { rows } = await pool.query(`SELECT * FROM files`)
        return rows;
    } catch(err){
        console.error("Error getting files data: ", err)
    }
}

async function addFile(name, path, date_added, size, folder_id){
    try{
        await pool.query(`INSERT INTO files (name, path, date_added, size, folder_id)
            VALUES ($1, $2, $3, $4, $5)`, 
        [name, path, date_added, size, folder_id])
        console.log("File added to database.")
    } catch(err){
        console.error("Error adding file to the database: ", err);
    }
}

module.exports = { addUser, getFolders , getFolderId, addFolder, getFiles, addFile }