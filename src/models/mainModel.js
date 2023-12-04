const fs = require('fs');
const {resolve} = require('path');
const statusModel = require('./statusModel')
const ballsModel = require('./ballsModel')
const pokemon = JSON.parse(fs.readFileSync(resolve(__dirname,'..','data','pokemon.json')))
const status = JSON.parse(fs.readFileSync(resolve(__dirname,'..','data','status.json')))
const balls = JSON.parse(fs.readFileSync(resolve(__dirname,'..','data','balls.json')))

module.exports = {
    allPoke: function(){
        return pokemon
    },
    allBalls: function(){
        return balls
    },
    allStatus: function(){
        return status
    },
    findRatio: function(id) {
        let poke = pokemon.find(p => p.id == id)
        poke.ratio = parseInt(poke.ratio);
        poke.status = parseInt(poke.status);
        poke.ballratio = parseInt(poke.ballratio);
        return poke
    },
    random: function(quantity, max){
        let array = [];
        for (let i = 0; i < quantity; i++) {
            array.push(Math.trunc(Math.random()*(max+1)))
        }
        if (array.length == 0) {
            return "Error"
        } else if (array.length == 1) {
            return array[0]
        } else {
            return array
        }
    },
    stGetA: function(number){
        return this.random(1,number)
    },
    stGetB: function(){
        return this.random(1, 255)
    },
    stGetC: function(){},
    stGetD: function(){},
    stGetStatus: function(status){
        let value = ""
        switch (status) {
            case "Dormido":
            case "Congelado":
                value = 25
                break;
            case "Paralizado":
            case "Envenenado":
            case "Quemado":
                value = 12
                break
            default:
                value = 0
                break;
        }
        return value
    },
    stGetX: function(maxps, actps, superBonus){
        let top = maxps * 255 * 4
        let bottom = actps * superBonus
        return top / bottom
    },
    stGetS: function(ball){
        let value = 0
        switch (ball) {
            case "Poke Ball":
                value = 255
                break;
            case "Super Ball":
                value = 200
                break;
            case "Ultra Ball" || "Safari Ball":
                value = 150
                break;
            case "Master Ball":
                value = 1
                break;
            default:
                value = 1000000
                break;
        }
        return value
    },
    stFirstCatch: function(data, tries) {
        let request = {
            ball: ballsModel.findRatio(data.ballratio).name,
            pokemon: this.findRatio(data.pokeratio).ratio,
            status: statusModel.findRatio(data.status).status
        }

        tries.actualData.s = this.stGetS(request.ball)
        tries.actualData.a = this.stGetA(tries.actualData.s)
        let statusBonus = this.stGetStatus(request.status)
        let finalFirstValue = tries.actualData.a - statusBonus
        
        
        if (finalFirstValue < 0) { // Reparar
            tries.actualData.firstTry = true
            tries.firstTry++
            tries.total++
        } else if (finalFirstValue >= 0 && finalFirstValue > request.pokemon.ratio) {
            tries.actualData.jump = true
        }

        tries.request = request
        
        return tries
    },
    stSecondCatch: function(data, tries) {

        let superBonus = this.stGetS(tries.request.ball) == "Super Ball" ? 8 : 12
        tries.actualData.x = this.stGetX(data.maxps, data.actps, superBonus)
        if (tries.actualData.jump == true) {
            tries.dontAcc++
        }
        if (tries.actualData.firstTry == false && tries.actualData.jump == false) {
            tries.actualData.b = this.stGetB();
            let calc = tries.actualData.b <= tries.actualData.x
            //console.log("El valor de "+tries.actualData.b + " es menor o igual al de "+ tries.actualData.x + "? La consola dice que "+ calc);
            if (calc) {
                tries.secondTry++;
                tries.actualData.secondTry = true;
                tries.total++   
            }
        } else {
            tries.actualData.firstTry = false
            tries.actualData.jump = false
        }

        
        return tries
    },
    stTicks: function () {

    },
    stTest: function (data, object) {
        let test = object
        let accumulator = 0
        for (let i = 1; i < 10000; i++) {
            let firstResult = this.stFirstCatch(data, test);
            var secondResult = this.stSecondCatch(data, firstResult);
            accumulator = secondResult.total * 100 / 10000
            
            test = secondResult
        }

        console.log(accumulator);
        return test
    },
    rdACalc: function(data){
        let firstValue = parseInt(data.maxps) * 3
        let secondValue = parseInt(data.actps) * 2
        let topCount = (firstValue - secondValue) * data.pokeratio * data.ballratio
        let finalCount = (topCount / firstValue) * data.status
        let status = {
            aCatches: finalCount >= 255 ? true : false,
            aValue: finalCount,
            prob: (finalCount / 2.55).toFixed(2)
        }
        return status
    },
    rdBCalc: function (a) {
        let randomArray = this.random(4, 65535);
        let b = 1048560 / (Math.sqrt(Math.sqrt(16711680/a)));
        let situation = {
            bCatches: false,
            ticks: 0
        }
        randomArray.forEach(n => n <= b ? situation.ticks++ :"")
        if (situation.ticks == 4) {
            situation.bCatches = true;
            situation.ticks--
        }
        return situation
    },        
    rdTest: function (data){
        let testing = {
            aCatches: 0,
            aMisses: 0,
            bCatches: 0,
            bMisses: 0
        }
        let actual = this.rdACalc(data).aValue
        for (let i = 0; i < 1000000; i++) {
            if (actual == 100) {
                testing.aCatches = 1
            } else {
                testing.aMisses = 1
                this.rdBCalc(actual).bCatches == true ? testing.bCatches++ : testing.bMisses++
            }
        }
        return testing
    }
}