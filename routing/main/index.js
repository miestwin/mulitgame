const path = require("path");
const express = require("express");
const router = express.Router();

/**
 * Ścieżka do pliku html gry
 */
const mainPath = path.join(__dirname, "../../../dist/index.html");

router.get("/", (req, res) => {
  res.sendFile(mainPath);
});

module.exports = router;
