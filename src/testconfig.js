const path = require('path');
const config = require(path.join(__dirname,'config.js'));

console.log(config.getWindowCfgById(0));
console.log(config.getWindowCfgByTitle('Main Window'));
console.log(config.getWindowTitleById(0));