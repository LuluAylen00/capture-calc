const {Router} = require('express');
const app = Router();
const mainController = require('../controllers/mainController');

app.get('/', mainController.index)
app.post('/sentSt', mainController.analyzeSt)
app.post('/sentNd', mainController.analyzeNd)
app.post('/sentRd', mainController.analyzeRd)
app.post('/sentTh', mainController.analyzeTh)

module.exports = app;