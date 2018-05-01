const fs = require('fs');
const path = require('path');
const postgres = require('pg');
const format = require('pg-format');
const helper = require('../helper');

const Database = function () {
    this.createDatabase = async function (database) {
        if (!database || typeof (database) !== 'string') {
            throw 'Invalid Name for Creating a Database';
        }

        let databaseConfig;
        try { // Try to load Database Configuration File that has the Username, Password, Database Name, Port, and Hostname for the Database
            databaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database-config.json'), 'utf-8'));
        } catch (error) {
            console.log('Invalid Database Configuration File: ' + error);
            throw ('Cannot Load Database');
        }

        // Ensure that the Database Config File is of the proper format.
        if (!databaseConfig.user || typeof (databaseConfig.user) !== 'string' ||
            !databaseConfig.password || typeof (databaseConfig.password) !== 'string' ||
            !databaseConfig.admindatabase || typeof (databaseConfig.admindatabase) !== 'string' ||
            !databaseConfig.port || typeof (databaseConfig.port) !== 'string' ||
            !databaseConfig.host || typeof (databaseConfig.host) !== 'string') {
            throw 'Invalid Database Configuration';
        }

        databaseConfig.database = databaseConfig.admindatabase;

        const tempPool = new postgres.Pool(databaseConfig);
        try {
            const client = await tempPool.connect(); // Attempt to get a connection to the DBMS
            try {
                // Try to see if the Database we want exists (Postgres doesn't have CREATE DATABASE IF NOT EXISTS)
                let result = await client.query(format('SELECT 1 FROM pg_database WHERE datname = \'%I\';', database));
                if (result.rowCount === 0) { // If nothing was found, we create the database
                    result = await client.query(format('CREATE DATABASE %I', database));
                }
                // Configure the actual Database pool which will be used for all future connections
            } finally {
                // Release that connection
                client.release();
            }
        } catch (error) {
            console.log('Error: ' + error);
        }
    };

    this.getDatabasePool = async function (user, password, database) {
        if (!database || typeof (database) !== 'string') {
            throw 'Invalid Name for Creating a Database';
        }

        if (!helper.isValidString(user)) {
            throw 'Invalid User for Creating a Database';
        }

        if (!helper.isValidString(password)) {
            throw 'Invalid Password for Creating a Database';
        }

        let databaseConfig;
        try { // Try to load Database Configuration File that has the Username, Password, Database Name, Port, and Hostname for the Database
            databaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database-config.json'), 'utf-8'));
        } catch (error) {
            console.log('Invalid Database Configuration File: ' + error);
            throw ('Cannot Load Database');
        }

        // Ensure that the Database Config File is of the proper format.
        if (!helper.isValidString(databaseConfig.port) ||
            !helper.isValidString(databaseConfig.host)) {
            throw 'Invalid Database Configuration';
        }

        const tempDatabaseConfig = {};

        tempDatabaseConfig.user = user;
        tempDatabaseConfig.password = password;
        tempDatabaseConfig.database = database;
        tempDatabaseConfig.port = databaseConfig.port;
        tempDatabaseConfig.host = databaseConfig.host;

        const returnPool = new postgres.Pool(tempDatabaseConfig);

        return returnPool;
    };

    this.getDefaultDatabasePool = async function (dbPool) {
        if (dbPool) {
            return dbPool;
        }

        let databaseConfig;
        try { // Try to load Database Configuration File that has the Username, Password, and Database Name
            databaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database-config.json'), 'utf-8'));
        } catch (error) {
            console.log('Invalid Database Configuration File: ' + error);
            throw ('Cannot Load Database');
        }

        // Ensure that the Database Config File is of the proper format.
        if (!helper.isValidString(databaseConfig.user) ||
            !helper.isValidString(databaseConfig.password) ||
            !helper.isValidString(databaseConfig.database)) {
            throw 'Invalid Database Configuration';
        }

        dbPool = await this.getDatabasePool(databaseConfig.user, databaseConfig.password, databaseConfig.database);

        return dbPool;
    };

    this.createUserTable = async function (dbPool, tableName) {
        if (!dbPool) {
            throw 'Invalid dbPool Object';
        }

        if (!helper.isValidString(tableName)) {
            throw 'Invalid Table Name for Creating User Table';
        }

        const createTable = 'CREATE TABLE IF NOT EXISTS %I (' +
            ' id TEXT PRIMARY KEY,' +
            ' username TEXT NOT NULL UNIQUE,' +
            ' email TEXT NOT NULL,' +
            ' access_token TEXT,' +
            ' refresh_token TEXT,' +
            ' color_choice TEXT' +
            ' );';

        const client = await dbPool.connect();
        const result = await client.query(format(createTable, tableName));
        client.release();

        return result;
    };
};
const getDatabase = () => {
    let currentDatabase = null;

    return () => {
        if (!currentDatabase) { // If no current Database Object
            currentDatabase = new Database(); // Make one
        }
        return currentDatabase; // Return Database Object
    };
};
module.exports = getDatabase();