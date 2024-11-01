const pool = require('./pool')

async function addUser(name, hashedPassword, username){
    try {
        await pool.query(`
            INSERT INTO users (name, password_hash, email)
            VALUES ($1, $2, $3)`, [name, hashedPassword, username])
        console.log("User added to database.")
    } catch (err){
        console.error("Error adding user to database: ", err)
    }
}

async function getFolders(userId){
    try{
        const { rows } = await pool.query(`
            SELECT * FROM folders
            WHERE user_id = $1`,
            [userId]);
        return rows;
    } catch(err){
        console.error("Error getting folder data: ", err)
    }
}

async function getFolderId(name, userId){
    const { rows } = await pool.query(`
        SELECT id FROM folders 
        WHERE name = $1 AND user_id = $2`, 
        [name, userId]);
    return rows;
}

async function addFolder(name, userId) {
    try {
        await pool.query(`
            INSERT INTO folders(name, user_id) 
            VALUES ($1, $2)`, 
            [name, userId])
        console.log("Folder added to database.")
    } catch (err){
        console.error("Error adding new folder: ", err)
    }
}

async function getFiles(userId) {
    try{
        const { rows } = await pool.query(`
            SELECT * FROM files 
            WHERE user_id = $1`,
        [userId])
        return rows;
    } catch(err){
        console.error("Error getting files data: ", err)
    }
}

async function addFile(name, path, dateAdded, size, folderId, userId){
    try{
        await pool.query(`
            INSERT INTO files (name, path, date_added, size, folder_id, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)`, 
            [name, path, dateAdded, size, folderId, userId])
        console.log("File added to database.")
    } catch(err){
        console.error("Error adding file to the database: ", err);
    }
}

module.exports = { addUser, getFolders , getFolderId, addFolder, getFiles, addFile }