const path = require('path');
const config = require(path.join(__dirname,'config.js'));

/* console.log(config.windowConfig);
console.log(config.menuConfig);
console.log(config.getWindowCfgById(0));
console.log(config.getWindowCfgByTitle('Main_Window'));
 */
console.log(config.getWindowTitleById(0));


const config2 = require(path.join(__dirname,'config.js'));
console.log(config.getWindowCfgByTitle('Main_Window'));
