const fs = require('fs');
const {resolve} = require('path');
const ballsList = JSON.parse(fs.readFileSync(resolve(__dirname,'..','data','balls.json')))

module.exports = {
    findRatio: function(id) {
        let ball = ballsList.find(b => b.id == id)
        ball.ratio = parseInt(ball.ratio)
        return ball
    }
}