import Game from './Game';

document.addEventListener('DOMContentLoaded', function () {
    startApp();
});

function startApp(): void {
    const gameConfig = {
        width: window.innerWidth,
        height: window.innerHeight,
        renderer: Phaser.AUTO,
        parent: document.getElementById('game'),
        resolution: 1
    };
    const game = new Game(gameConfig);
}


