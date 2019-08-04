const mongodb = require('mongodb');

let config = {};
config.db = {};
config.db.host = 'localhost:27017';
config.db.name = 'account';
module.exports = config;

const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

mongoClient.connect(mongoUri)
.then((db) => {
 
})
.catch((err) => {

});
