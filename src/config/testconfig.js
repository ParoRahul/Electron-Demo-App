const path = require('path');
const config = require(path.join(__dirname,'config.js'));

/* console.log(config.windowConfig);
console.log(config.menuConfig);
console.log(config.getWindowCfgById(0));
console.log(config.getWindowCfgByTitle('Main_Window'));
 */



//const config2 = require(path.join(__dirname,'config.js'));
console.log(config.getWindowCfgByTitle('Main_Window'));
