const path = require('path');
const database = require('../database/index')();
const fs = require('fs');

const users = module.exports;

users.TABLE_NAME = 'usertable';

let dbPool = null;

users.getDatabasePool = async function () {
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
	if (!databaseConfig.user || typeof (databaseConfig.user) !== 'string' ||
		!databaseConfig.password || typeof (databaseConfig.password) !== 'string' ||
		!databaseConfig.database || typeof (databaseConfig.database) !== 'string') {
		throw 'Invalid Database Configuration';
	}

	dbPool = await database.getDatabasePool(databaseConfig.user, databaseConfig.password, databaseConfig.database);

	return dbPool;
};

users.config = async function () {
	const dbPool = await users.getDatabasePool();
	try {
		await database.createUserTable(dbPool, users.TABLE_NAME);
	} catch (e) {
		console.log('Failed to Create User Table!: ' + e);
	}
};