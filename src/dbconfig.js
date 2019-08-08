/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Basic DB Configuration File  
 * 
 */

const path = require('path')
const db = {
    'dbpath'            : path.join(__dirname,"..","db"),
    'hostIp'            : 'localhost',
    'port'              :  2001,
    'dbname'            : 'grootdb',
    'userid'            : 'grootuser',
    'password'          : 'grootpassword',
}

const serveroptions={
    useNewUrlParser: true ,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
}

const collList=['itemMaster','comapanyMaster','ledgerMaster']
const collections=['appUser']

const appUser={
    autoIndexId:true,
    validator: {
        $jsonSchema: {
           bsonType: "object",
           required: [ "name"],
           properties: {
                name: {
                $type: "string",
                description: "must be a string and is required"
              }
            }
        }
    },
    validationLevel:"strict",
    validationAction:"error"
}

const itemMaster={
    autoIndexId:true,
    validator: {
        $jsonSchema: {
           bsonType: "object",
           required: [ "name"],
           properties: {
                name: {
                $type: "string",
                description: "must be a string and is required"
              }
            }
        }
    },
    validationLevel:"strict",
    validationAction:"error"
}

module.exports = {
    'db'                : db,
    'serveroptions'     : serveroptions,
    'collections'       : collections,
    'appUser'           : appUser
}
