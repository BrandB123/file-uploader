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

module.exports = { addUser }