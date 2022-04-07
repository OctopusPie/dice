const express = require('express');
const bp = require('body-parser')

const utils = require('./utils.js');
const CONFIG = require('./config.json');

const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.listen(CONFIG.listeningPort, () => {
    console.log('Server is listening');
});

// Routes
app.post('/roll', (req,res) => {
    console.log('POST /roll');
    res.status(200).json(utils.roll(req.body));
});

app.post('/average', (req,res) => {
    console.log('POST /average');
    res.status(200).json(utils.average(req.body));
});

// POST /average    : k:params  v:[operation, intensite, repetition]
// POST /median     : k:params  v:[operation, intensite, repetition]
// POST /lowerRoll  : k:params  v:[operation, intensite, diceNumber, minus]
// POST /higherRoll : k:params  v:[operation, intensite, diceNumber, minus]