/* ==========================================================================================*/
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const db = require('../database/index.js')();
const users = require('../database/users.js');
const requests = require('./requests');
const database = require('../database')();

const BASE_URI = 'http://localhost:';
const PORT = '3001';
const REACT_PORT = '3000';
const REDIRECT_PATH = '/reddit/api/authorization';

let client_id;
let client_secret;
/* ==========================================================================================*/

/* ==========================================================================================*/
async function main() {
	const data = fs.readFileSync(path.join(__dirname, '../../data/redditApi.json'));

	if (!data) {
		console.error('No Reddit API Keys Found');
		process.exit(1);
	}

	const jsonData = JSON.parse(data);
	if (!jsonData.client_id || !jsonData.client_secret) {
		console.error('Invalid Reddit API Keys Found');
		process.exit(1);
	}

	client_id = jsonData.client_id;
	client_secret = jsonData.client_secret;
	/* ==========================================================================================*/
	const createDatabase = async function () {
		let databaseConfig;
		// Try to load Database Configuration File that has the Username, Password, and Database Name
		try {
			databaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database-config.json'), 'utf-8'));
		} catch (error) {
			console.log('Invalid Database Configuration File: ' + error);
			throw ('Cannot Load Database');
		}

		// Ensure that the Database Config File is of the proper format.
		if (!databaseConfig.database || typeof (databaseConfig.database) !== 'string') {
			throw 'Invalid Database Configuration';
		}

		await db.createDatabase(databaseConfig.database);
	}
	await createDatabase();
	await users.config();
	/* ==========================================================================================*/
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());

	app.get(REDIRECT_PATH, async (req, res) => {
		try {
			if (!req.query.code) {
				console.log("I failed I need to handle this 1.");
			}
			const response = await requests.getAccessToken(client_id, client_secret, req.query.code, BASE_URI + PORT + REDIRECT_PATH);
			if (!response.access_token || !response.token_type ||
				!response.expires_in || !response.refresh_token ||
				!response.scope) {
				console.log("I failed I need to handle this 2.");
			}
			const me = await requests.getMe(response.access_token);
			if (!me || !me.name) {
				console.log("I failed I need to handle this 3");
			}
			let userObject;
			let dbPool = await users.getDatabasePool();
			const results = await database.getUserByUsername(dbPool, users.TABLE_NAME, me.name);

			if (results && results.rows && results.rows[0]) {
				userObject = results.rows[0];
			}

			if (!userObject) {
				userObject = {};
				userObject.username = me.name;
				userObject.access_token = response.access_token;
				userObject.refresh_token = response.refresh_token;
				userObject.scope = response.scope;
				userObject.id = uuid.v4();
				dbPool = await users.getDatabasePool();
				await database.insertUser(dbPool, users.TABLE_NAME, userObject);
			}
			console.log(userObject);
			res.cookie('cs554RedditReader', userObject.id, {
				maxAge: 2147483647
			});
			res.redirect(BASE_URI + REACT_PORT);
		} catch (e) {
			console.error(e);
			res.status(500).json({
				error: 'Failed to Authorize Account'
			});
		}
	});

	app.get('/configure', async (req, res) => {
		if (!req.cookies || !req.cookies.cs554RedditReader) {
			res.json({});
			return;
		}
		const dbPool = await users.getDatabasePool();
		const results = await database.getUserById(dbPool, users.TABLE_NAME, req.cookies.cs554RedditReader);
		if (!results || !results.rows || !results.rows[0]) {
			res.json({});
			return;
		}
		console.log(results.rows[0]);
		res.json(results.rows[0]);
	});

	app.get('/refreshToken', async (req, res) => {
		if (!req.cookies || !req.cookies.cs554RedditReader) {
			res.status(401).json({error: 'No Cookie Set'});
			return;
		}

		let dbPool = await users.getDatabasePool();
		const results = await database.getUserById(dbPool, users.TABLE_NAME, req.cookies.cs554RedditReader);
		let user;

		if (results && results.rows && results.rows[0]) {
			user = results.rows[0];
		}
		
		if (!user) {
			res.status(401).json({error: 'Not Authorized'});
			return;
		}

		try {
			if (!user.refresh_token) {
				res.cookie('cs554RedditReader', null);
				res.redirect(req.get('referer'));
				return;
			}
			const response = await requests.refreshAccessToken(client_id, client_secret, user.refresh_token, BASE_URI + PORT + REDIRECT_PATH);
			if (!response.access_token || !response.token_type ||
				!response.expires_in ||
				!response.scope) {
				res.cookie('cs554RedditReader', null);
				res.redirect(req.get('referer'));
				return;
			}
			const me = await requests.getMe(response.access_token);
			if (!me || !me.name) {
				res.cookie('cs554RedditReader', null);
                res.redirect(req.get('referer'));
                return;
			}
			user.username = me.name;
			user.access_token = response.access_token;
			user.scope = response.scope;
			dbPool = await users.getDatabasePool();
			await database.updateUser(dbPool, users.TABLE_NAME, user);
			res.cookie('cs554RedditReader', user.id, {
				maxAge: 2147483647
			});
			res.redirect(req.get('referer'));
		} catch (e) {
			console.log(e);
			res.status(500).json({
				error: 'Failed to Refresh Account'
			});
		}


	});

	app.get('/reddit/url', async (req, res) => {
		res.json({
			url: 'https://www.reddit.com/api/v1/authorize?' +
				'client_id=' + client_id +
				'&response_type=code' +
				'&state=' + uuid.v4() +
				'&redirect_uri=' + BASE_URI + PORT + REDIRECT_PATH +
				'&duration=permanent' +
				'&scope=identity read history mysubreddits'
		});
	});

	app.post('/register/email', async (req, res) => {
		if (!req.cookies || !req.cookies.cs554RedditReader) {
			res.status(401).json({error: 'No Cookie Set'});
			return;
		}

		if (!req.body.email) {
			res.status(400).json({error: 'Invalid Email Entered'});
			return;
		}
		try {
			let dbPool = await users.getDatabasePool();
			const results = await database.getUserById(dbPool, users.TABLE_NAME, req.cookies.cs554RedditReader);
	
			if (!results || !results.rows || !results.rows[0]) {
				res.status(500).json({error: 'Failed to update Email'});
				return
			}
	
			dbPool = await users.getDatabasePool();
			await database.updateUser(dbPool, users.TABLE_NAME, {id: req.cookies.cs554RedditReader, email: req.body.email});

			res.sendStatus(200);
		} catch (e) {
			console.log(e);
			res.status(500).json({error: 'Failed to update Email'});
		}
	});

	app.post('/register/color', async (req, res) => {
		if (!req.cookies || !req.cookies.cs554RedditReader) {
			res.status(401).json({error: 'No Cookie Set'});
			return;
		}

		if (!req.body.color_choice) {
			res.status(400).json({error: 'Invalid Color sent'});
			return;
		}
		try {
			let dbPool = await users.getDatabasePool();
			const results = await database.getUserById(dbPool, users.TABLE_NAME, req.cookies.cs554RedditReader);
	
			if (!results || !results.rows || !results.rows[0]) {
				res.status(500).json({error: 'Failed to update color choice'});
				return
			}
	
			dbPool = await users.getDatabasePool();
			await database.updateUser(dbPool, users.TABLE_NAME, {id: req.cookies.cs554RedditReader, color_choice: {color: req.body.color_choice}});

			res.sendStatus(200);
		} catch (e) {
			console.log(e);
			res.status(500).json({error: 'Failed to update color choice'});
		}
	});

	app.use('*', (req, res) => {
		res.sendStatus(404);
	});

	app.listen(3001, () => {
		console.log('Express Server Running at http://localhost:3001');
	});
}
main();
/* ==========================================================================================*/