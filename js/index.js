const express = require('express');
const utils = require('./utils.js');

const app = express();

app.listen(8080, () => {
    console.log('Serveur à l\'écoute');
});

app.get('/roll', (req,res) => {
    res.status(200).json({
        roll: utils.roll(),
        success: true
    });
})