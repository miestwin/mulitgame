import Controller from "./Controller";

document.addEventListener("DOMContentLoaded", function() {
  startApp();
});

/**
 * Uruchamia aplikację
 * 
 */
function startApp(): void {
  if (isTouchDevice()) {
    const controllerConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      renderer: Phaser.AUTO,
      parent: document.getElementById("controller"),
      resolution: 1
    };
    // create controller
    const controller = new Controller(controllerConfig);
  } else {
    document.getElementById("touch").style.display = "flex";
  }
}

function isTouchDevice() {
  return "ontouchstart" in document.documentElement;
}
