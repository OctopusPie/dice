const express = require('express');
const utils = require('./utils.js');
const CONFIG = require('./config.json');

const app = express();

app.listen(CONFIG.listeningPort, () => {
    console.log('Serveur à l\'écoute');
});

app.get('/roll', (req,res) => {
    res.status(200).json({
        roll: utils.roll(),
        success: true
    });
})