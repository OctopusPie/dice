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

app.post('/median', (req,res) => {
    console.log('POST /median');
    res.status(200).json(utils.median(req.body));
});

app.post('/higherRoll', (req,res) => {
    console.log('POST /higherRoll');
    res.status(200).json(utils.targetRoll(req.body, true));
});

app.post('/lowerRoll', (req,res) => {
    console.log('POST /lowerRoll');
    res.status(200).json(utils.targetRoll(req.body, false));
});

// POST /roll       : k:params  v:[operation]                               STATUS : DONE    - TEST : DONE
// POST /average    : k:params  v:[operation, intensite, repetition]        STATUS : DONE    - TEST : NEEDED
// POST /median     : k:params  v:[operation, intensite, repetition]        STATUS : DONE    - TEST : NEEDED
// POST /lowerRoll  : k:params  v:[operation, intensite, diceNumber, minus] STATUS : NONE    - TEST : NEEDED
// POST /higherRoll : k:params  v:[operation, intensite, diceNumber, minus] STATUS : NONE    - TEST : NEEDED