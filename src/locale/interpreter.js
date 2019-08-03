const path = require('path');
const fs = require('fs');

function interpreter() {
    if(fs.existsSync(path.join(__dirname,'en','strings.json'))) {
        this.locales = JSON.parse(fs.readFileSync(path.join(__dirname,'en','strings.json'), 'utf8'))
    }
    else {
        throw new Error(' Whoops! strings.json not found ');
    }
}

interpreter.prototype.__ = function(phrase) {
    let translation = this.locales[phrase]
    if(translation === undefined) {
        translation = phrase
    }
    return translation
}

module.exports = interpreter;