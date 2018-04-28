const databaseModule = module.exports;

const database = {};

databaseModule.insertUserIntoDatabase = async user => {
    if (!database[user.name]) {
        database[user.name] = user;
        database[user.id] = user;
    }
} 

databaseModule.getUserByName = async name => {
    if (!database[name]) {
        return null;
    }

    return database[name];
}

databaseModule.getUserByUUID = async uuid => {
    if (!database[uuid]) {
        return null;
    }

    return database[uuid];
}