const main = require("./main");
const comets = require("./comets");

module.exports = function(app) {
  app.use("/", main);
  app.use("/comets", comets);
};
