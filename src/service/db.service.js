const PouchDB = require('pouchdb');

class DbService{
    constructor(dbName ,dbPath){
        this.database = new PouchDB(dbName,{ 
            prefix: dbPath,
            auto_compaction: true,    // Only store latest records
        });
        this.database.info().then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.log(err);
        });      
    }

    getAllDocument(){
        return this.database.allDocs({include_docs: true,attachments: true})
        .catch((error)=>{
            handleError(error)
        })
    }

    getDocument(id){
        return this.database.get(id)
        .catch((error)=>{
            handleError(error)
        })
    }

    putDocument(document){
        return this.database.put(document)
        .catch((error)=>{
            handleError(error)
        })
    }

    deleteDocument(id){
        return this.database.remove(id)
        .catch((error)=>{
            handleError(error)
        })
    }

    closeDb(){
        return this.database.close()
        .catch((error)=>{
            handleError(error)
        })
    }

    handleError(error){
        if(error.status === 400)
            return throwError( new BadRequestError(error))
        else if (error.status === 404)
            return throwError( new NotFoundError(error))  
        else if (error.status === 409)
            return throwError( new ConflictError(error))
        else
            return throwError( new AppError(error))
    }
}

module.exports = DbService;