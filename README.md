CS-554 Final Project - ViewIt, a Reddit Reader
Ian Allemand, Matthew Gomez, Christian Harrypersad, Matthew Mahoney, Alex Massenzio
We Pledge our honor that we have abided by the Stevens Honor System

Installation Dependencies:
1) Postgresql: https://www.postgresql.org/
2) Redis: https://redis.io/
3) NodeJs: https://nodejs.org/en/
4) NPM: https://www.npmjs.com/

How to run Application:
1) First, edit your database credentials in database-config.json (Default setup is user: postgres password: password)
2) Ensure that the files ./data/redditApi.json and sendGridApi.json have your key information
    For this submission we have prefilled them with our API keys. Please, don't abuse this. 
    Otherwise, you would just follow the formatting instructions in ./data/FORMAT.txt to properly format the files
3) Type "npm install" to install all the other Application Dependencies
4) Finally, type "npm start", which should begin all parts of our application.

Since we do not create user accounts -- and only store tokens from Reddit -- there is no way for us
to seed the database with a user account. You will need to Log in to Reddit and approve our application.
This process is easily accomplished through ViewIt, by clicking "Log In" in the Application's header. 

*Note* Due to the way Reddit's API works, you will need to make all calls to this application through localhost:3000,
otherwise, Reddit will not allow the Log In Calls to go through since it can't callback to another address. 