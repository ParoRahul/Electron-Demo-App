const DbService = require('./db.service.js');


class UserService extends dbservice{
    constructor(dbName ,dbPath){
        super(dbName ,dbPath)
    }
}

const userService = new UserService();
Object.freeze(userService);

export default userService;