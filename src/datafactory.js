const Datastore = require('nedb-promises');
const configs = require('../../config/config.js');

const dbFactory = (fileName) => Datastore.create({
  filename: fileName, 
  timestampData: true,
  autoload: true
})

const db = {
    projectDB: dbFactory(configs.DBPath)
}

db.projectDB.ensureIndex({ fieldName:'id',unique:true});
db.projectDB.on('__error__', (datastore, event, error, ...args) => {
    // for example
    // datastore, 'find', error, [{ foo: 'bar' }, {}]
})

module.exports = db;