import 'p2';
import 'pixi';
import 'phaser';

export const ships = {
    'player-ship_green': 0x33cc33,
    'player-ship_purple': 0x9933ff,
    'player-ship_blue': 0x0066ff,
    'player-ship_watery': 0x009999,
    'player-ship_pink': 0xff3399,
    'player-ship_red': 0xcc2900,
    'player-ship_yellow': 0xd1d123,
    'player-ship_orange': 0xcc5200,
    'player-ship_grass': 0x739900,
    'player-ship_darkpink': 0x993333
};

export function generateShips(game: Phaser.Game) {
    Object.keys(ships).forEach((ship) => {
        const graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x1f1f60);
        graphics.lineStyle(6, ships[ship], 1);
        graphics.moveTo(40,50);
        graphics.lineTo(100, 75);
        graphics.lineTo(40, 100);
        graphics.lineTo(60, 75);
        graphics.lineTo(40, 50);
        graphics.endFill();
        game.cache.addImage(ship, null, graphics.generateTexture().baseTexture.source);
        graphics.destroy();
    });
}