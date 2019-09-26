const DbService = require('./db.service.js');


class UserService extends dbservice{
    constructor(dbName ,dbPath){
        if(!!UserService.instance){
             return UserService.instance;
        }
        super(dbName ,dbPath)
        UserService.instance=this
        return this;
    }
}

module.exports = UserService;