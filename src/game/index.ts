import Game from "./Game";

document.addEventListener("DOMContentLoaded", requestFullscreen);
document.addEventListener("DOMContentLoaded", function() {
  startApp();
});

/**
 * Uruchamia aplikację
 * 
 */
function startApp(): void {
  const gameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    renderer: Phaser.AUTO,
    parent: document.getElementById("game"),
    resolution: 1
  };
  // create game
  const game = new Game(gameConfig);
}

function requestFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  }
}
