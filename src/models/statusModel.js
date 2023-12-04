const fs = require('fs');
const {resolve} = require('path');
const statusList = JSON.parse(fs.readFileSync(resolve(__dirname,'..','data','status.json')))

module.exports = {
    findRatio: function(id) {
        let status = statusList.find(s => s.id == id)
        status.ratio = parseInt(status.ratio)
        return status
    }
}