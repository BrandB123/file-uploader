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
    return rows[0].id;
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

async function updateFolder(oldName, newName, userId) {
    try {
        await pool.query(`
            UPDATE folders
            SET name = $1
            WHERE name = $2 AND user_id = $3`,
        [newName, oldName, userId])
        console.log("Folder name updated in database.")
    } catch (err){
        console.error("Error updating the folder :", err)
    }
}

async function deleteFolder(name, userId) {
    try {
        await pool.query(`
            DELETE FROM folders
            WHERE name = $1 AND user_id = $2`,
        [name, userId])
        console.log("Folder deleted from the database")
    } catch(err){
        console.error("Error removing folder: ", err)
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

async function getFile(name, userId){
    try{
        const { rows } = await pool.query(`
            SELECT * FROM files
            WHERE name = $1 AND user_id = $2`,
        [name, userId])
        return rows;
    } catch (err){
        console.error("Error getting file: ", err)
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

async function deleteFiles(userId, folderId){
    try {
        await pool.query(`
            DELETE FROM files
            WHERE user_id = $1 AND folder_id = $2`,
            [userId, folderId]
        )
        console.log("Files deleted from the database")
    } catch(err){
        console.error("Error removing files: ", err)
    }
}

module.exports = { addUser, getFolders , getFolderId, addFolder, updateFolder, deleteFolder, getFiles, getFile, addFile, deleteFiles }