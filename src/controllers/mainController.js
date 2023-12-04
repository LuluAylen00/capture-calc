const pokeModel = require('../models/mainModel')
const statusModel = require('../models/statusModel')
const ballsModel = require('../models/ballsModel')

let pokeList = pokeModel.allPoke();
let ballsList = pokeModel.allBalls();
let statusList = pokeModel.allStatus();

module.exports = {
    index: (req, res) => { 
        return res.render("home", {data: {}, pokeList, ballsList, statusList, previous: {}});
    },
    analyzeSt: (req, res) => {
        let tries = {
            firstTry: 0,
            secondTry: 0,
            acc: 0,
            dontAcc: 0,
            total: 0,
            ticks: {
                one: 0,
                two: 0,
                three: 0,
                failed: 0
            },
            actualData: {
                jump: false,
                firstTry: false,
                secondTry: false,
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                s: 0,
                x: 0,
            }
        }
        let data = {
            status: parseInt(req.body.status),
            maxps: parseInt(req.body.maxps),
            actps: parseInt(req.body.actps),
            pokeratio: parseInt(req.body.pokeratio),
            ballratio: parseInt(req.body.ballratio),
        };
        
        let firstResult = pokeModel.stFirstCatch(data, tries);
        let secondResult = pokeModel.stSecondCatch(data, firstResult);
        console.log(pokeModel.stTest(data, tries));
        let previous = {
            status: statusModel.findRatio(req.body.status).status,
            maxps: req.body.maxps,
            actps: req.body.actps,
            pokeratio: pokeModel.findRatio(req.body.pokeratio).name,
            ballratio: ballsModel.findRatio(req.body.ballratio).name,
            error: parseInt(req.body.maxps) < parseInt(req.body.actps) ? 1 : 0,
            pokegen: req.body.pokegen
        }
        return res.render("home", { data: { }, pokeList, ballsList, statusList, previous });
    },
    analyzeNd: (req, res) => {},
    analyzeRd: (req, res) => {
        let data = {
            status: statusModel.findRatio(req.body.status).ratio,
            maxps: parseInt(req.body.maxps),
            actps: parseInt(req.body.actps),
            pokeratio: pokeModel.findRatio(req.body.pokeratio).ratio,
            ballratio: ballsModel.findRatio(req.body.ballratio).ratio
        };
        let a = pokeModel.rdACalc(data);
        let percent = {
            estimated: 0,
            actual: 0
        };
        if (a.aCatches != true) {
            var b = pokeModel.rdBCalc(a.aValue);
            var test = pokeModel.rdTest(data);
            percent = {
                estimated: a == true ? 100 : a.prob,
                actual: test.bCatches * 100 / 1000000
            }
        } else {
            percent = {
                estimated: a == true ? 100 : a.prob,
                actual: a == true ? 100 : a.prob
            }
        }
        
        let previous = {
            status: statusModel.findRatio(req.body.status).status,
            maxps: req.body.maxps,
            actps: req.body.actps,
            pokeratio: pokeModel.findRatio(req.body.pokeratio).name,
            ballratio: ballsModel.findRatio(req.body.ballratio).name,
            error: parseInt(req.body.maxps) < parseInt(req.body.actps) ? 1 : 0,
            pokegen: req.body.pokegen
        }
        return res.render("home", { data: { a: a.aValue, b, test, percent}, pokeList, ballsList, statusList, previous });
    },
    analyzeTh: (req, res) => {}
}