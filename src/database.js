'use strict';
const config = require('./dbconfig.js')

class Database {
    constructor( ) {
        if (!!Database.instance) {
            return Database.instance;
        }
        this.dbname=config.db.dbname;
        this.hostip=config.db.hostIp;
        this.port=config.db.port;
        this.collections = config.collections;
        this.serveroptions=config.serveroptions;
        Database.instance = this;
        return this;
    }

}

module.exports = Database;