#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg');


const SQL = `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL,
    password_hash VARCHAR ( 255 ) NOT NULL,
    email VARCHAR ( 255 ) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS folders(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL
);

CREATE TABLE IF NOT EXISTS files(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL,
    path VARCHAR ( 400 ) NOT NULL,
    date_added TIMESTAMP NOT NULL,
    size INTEGER,
    folder_id INTEGER REFERENCES folders(id)
);
`;


async function main(){
    console.log("seeding...");
    try{
        const client = new Client({
            connectionString: process.env.CONNECTION_STRING,
        });
        await client.connect();
        await client.query(SQL);
        await client.end();
        console.log("done") 
    } catch(err){
        console.error(err)
    }
}

main()