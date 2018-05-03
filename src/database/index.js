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
            ' email TEXT,' +
            ' access_token TEXT,' +
            ' refresh_token TEXT,' +
            ' color_choice TEXT' +
            ' );';

        const client = await dbPool.connect();
        const result = await client.query(format(createTable, tableName));
        client.release();

        return result;
    };

    this.insertUser = async function (dbPool, tableName, user) {
        if (!dbPool) {
            throw 'Invalid dbPool Object';
        }

        if (!helper.isValidString(tableName)) {
            throw 'Invalid Table Name for Inserting User';
        }

        if (!user) {
            throw 'Invalid User Object to Insert into Database';
        }

        if (!helper.isValidString(user.id)) {
            throw 'Invalid id for User to Insert into User Table';
        }

        if (!helper.isValidString(user.username)) {
            throw 'Invalid username for User To Insert into User Table';
        }

        if (!helper.isValidStringIfExists(user.email)) {
            throw 'Invalid email for User to Insert into User Table';
        }
        if (!helper.isValidStringIfExists(user.access_token)) {
            throw 'Invalid access_token for User to Insert into User Table';
        }
        if (!helper.isValidStringIfExists(user.refresh_token)) {
            throw 'Invalid refresh_token for User to Insert into User Table';
        }
        if (!helper.isValidStringIfExists(user.color_choice)) {
            throw 'Invalid color_choice for User to Insert into User Table';
        }

        const insertIntoTable = 'INSERT INTO %I (' +
            'id, username, email, access_token, refresh_token, color_choice) VALUES ' +
            '($1, $2, $3, $4, $5, $6);';

        const formattedQuery = format(
            insertIntoTable,
            tableName
        );

        const valueArray = [];

        valueArray.push(user.id);
        valueArray.push(user.username);
        valueArray.push(user.email);
        valueArray.push(user.access_token);
        valueArray.push(user.refresh_token);
        valueArray.push(user.color_choice);

        const client = await dbPool.connect();
        const result = await client.query(formattedQuery, valueArray);
        client.release();

        return result;
    };

    this.getUserById = async function (dbPool, tableName, id) {
        if (!dbPool) {
            throw 'Invalid dbPool Object';
        }

        if (!helper.isValidString(tableName)) {
            throw 'Invalid Table Name for Getting ID';
        }

        if (!helper.isValidString(id)) {
            throw 'Invalid ID to Look for User';
        }

        const selectQuery = 'SELECT * FROM %I WHERE id = %L;';

        const client = await dbPool.connect();
        const result = await client.query(format(selectQuery, tableName, id));
        client.release();

        return result;
    };

    this.getUserByUsername = async function (dbPool, tableName, username) {
        if (!dbPool) {
            throw 'Invalid database pool object - getting user info by username';
        }
        if (!helper.isValidString(tableName)) {
            throw 'Invalid table name string - getting user info by username';
        }
        if (!helper.isValidString(username)) {
            throw 'Invalid username string - getting user info by username';
        }

        const selectQuery = 'SELECT * FROM %I WHERE username = %L;';
        let client;
        let result;

        try {
            client = await dbPool.connect();
            result = await client.query(format(selectQuery, tableName, username));
        } catch (ex) {
            console.error(ex);
        } finally {
            client.release();
        }

        return result;
    };

    this.getAllWithEmails = async function (dbPool, tableName) {
        if (!dbPool) {
            throw 'Non-existent or invalid database pool for getAllEmails';
        }
        if (!tableName || typeof tableName !== 'string' || tableName.length === 0) {
            throw 'Non-existent or invalid user table name for getAllEmails';
        }

        const queryText = 'SELECT * FROM %I WHERE email IS NOT NULL;';

        let client;
        let result;

        try {
            client = await dbPool.connect();
            result = await client.query(format(queryText, tableName));
        } catch (ex) {
            console.error(ex);
        } finally {
            client.release();
        }

        return result;
    };

    this.updateUser = async function (dbPool, tableName, user) {
        if (!dbPool) {
			throw 'Invalid dbPool Object';
		}

		if (!helper.isValidString(tableName)) {
			throw 'Invalid Table Name for Getting ID';
		}

		if (!user) {
			throw 'Invalid user to Update';
		}

		if (!helper.isValidString(user.id)) {
			throw 'Invalid user id to update';
		}

		const valueArray = [];

		valueArray.push((user.username ? user.username : null));
        valueArray.push((user.email ? user.email : null));
        valueArray.push((user.access_token ? user.access_token : null));
        valueArray.push((user.refresh_token ? user.refresh_token : null));
        valueArray.push((user.color_choice ? user.color_choice : null));
		valueArray.push(user.id);

		const updateQuery = 'UPDATE %I ' +
							'SET username = COALESCE($1, username), ' +
                            'email = COALESCE($2, email), ' +
                            'access_token = COALESCE($3, access_token), ' +
                            'refresh_token = COALESCE($4, refresh_token), ' +
                            'color_choice = COALESCE($5, color_choice) ' +
							'WHERE id = $6 ' +
							'RETURNING *;';

		const client = await dbPool.connect();
		const result = await client.query(format(updateQuery, tableName), valueArray);
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