const fs = require('fs');
const path = require('path');

module.exports = {
    readJsonFile: function (filename) {
	    const fullPath = path.join(__dirname, 'data', filename);
	    const data = fs.readFileSync(fullPath, 'utf-8');
	    return JSON.parse(data);
    },
    writeJsonFile: function(filename, data) {
        const fullPath =  path.join(__dirname, 'data', filename);
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(fullPath, jsonData, 'utf-8');
    },
}