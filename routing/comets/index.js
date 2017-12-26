const path = require("path");
const express = require("express");
const router = express.Router();

const gamePath = path.join(__dirname, "../../dist/games/comets/game.html");
const controllerPath = path.join(
  __dirname,
  "../../dist/games/comets/controller.html"
);

router.get("/", (req, res) => {
  res.sendFile(gamePath);
});

router.get("/:id", (req, res) => {
  fs.readFile(controllerPath, (err, data) => {
    data = data.toString().replace("{{gameId}}", req.params.id);
    res.send(data);
  });
});

module.exports = router;
