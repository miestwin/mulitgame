const path = require('path');
const express = require('express');
const router = express.Router();

/**
 * Ścieżka do pliku html gry
 */
const gamePath = path.join(__dirname, '../../../dist/game/index.html');

router.get('/', (req, res) => {
    res.sendFile(gamePath);
});

module.exports = router;