const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();

/**
 * Ścieżka do pliku html kontrolera
 */
const controllerPath = path.join(__dirname, '../../../dist/controller/index.html');

router.get('/', (req, res) => {
    res.send('You must create game');
});

router.get('/:id', (req, res) => {
    fs.readFile(controllerPath, (err, data) => {
        data = data.toString().replace('{{gameId}}', req.params.id);
        res.send(data);
    })
});

module.exports = router;