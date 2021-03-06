/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Parent Calss of all scheduler 
 * 
 */
const path = require('path');
const baseScheduler = require(path.join(__dirname, "..", "scheduler.js"));

class usersScheduler extends baseScheduler {
    actionLoad() {
        this.render("index");
    }

    actionSignin() {
        this.render("signin");
    }

    actionConfirm() {
        this.render("dialog-confirm");
    }

    actionAbout() {
        let packJson = require(path.join(__dirname, "..", "..", "..", "package.json"));
        let version = packJson.version;
        this.render("dialog-about", { app_version: version });
    }
}
module.exports = usersScheduler;