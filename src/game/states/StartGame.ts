import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

/**
 * Start rozgrywki
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class StartGame extends Phaser.State {

    private cursor;
    private platform = {
        step: 77,
        scale: 0.3
    };

    private platforms: Phaser.Group;
    private ground: Phaser.Group;

    preload() {}

    create() {
        // var message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GAME START NOW', { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        // message.anchor.set(0.5);

        this.game.world.setBounds(0, 0, 50000, this.game.height);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        this.createPlatforms();

        Object.keys((<any>this.game.state).players).forEach(playerId => {
            (<any>this.game.state).players[playerId].init(this.game, 20, this.game.world.height - (5 * this.platform.step));
            (<any>this.game.state).players[playerId].run();
        });
        this.game.camera.follow((<any>this.game.state).players[Object.keys((<any>this.game.state).players)[0]].sprite);
        // this.game.camera.focusOnXY(window.innerWidth / 2, window.innerHeight / 2);
    }

    private createPlatforms() {
        let width = 0;

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        for (let i = 0; i < this.game.world.bounds.width; i = i + this.platform.step) {
            let tile = this.platforms.create(i, 0, 'tile-5');
            tile.scale.setTo(this.platform.scale);
            tile.body.immovable = true;
        }

        // create ground
        for (let i = 0; i < this.game.world.bounds.width; i = i + this.platform.step) {
            let tile = this.platforms.create(i, this.game.world.height - this.platform.step, 'tile-2');
            tile.scale.setTo(this.platform.scale);
            tile.body.immovable = true;
        }
        width += (10 * this.platform.step);
        this.generatePyramid(width, 3);
    }

    private generatePyramid(start: number, rows: number): number {
        let end = start;

        if (rows === 1) {
            let tile = this.platforms.create(start, this.game.world.height - (2 * this.platform.step), 'tile-2');
            tile.scale.setTo(this.platform.scale);
            tile.immovable = true;
            return start + this.platform.step;
        }

        let n = rows;
        let step = start;
        for (let i = 1; i <= rows; i++) {
            // let leftTile = this.platforms.create(start, this.game.world.height - (2 * this.platform.step), 'tile-1');
            // leftTile.scale.setTo(this.platform.scale);
            // leftTile.immovable = true;

            for (let j = 1; j <= (2*n + 1); j++) {
                let tile = this.platforms.create(step + (this.platform.step * j), this.game.world.height - ((i + 1) * this.platform.step), 'tile-5');
                tile.scale.setTo(this.platform.scale);
                tile.body.immovable = true;
                if (start <= step) {
                    start += this.platform.step;
                }
            }
            step += this.platform.step;
            n--;

            // let rightTile = this.platforms.create(start * rows, this.game.world.height - (2 * this.platform.step), 'tile-3');
            // rightTile.scale.setTo(this.platform.scale);
            // rightTile.immovable = true;
        }

        return start;
    }

    update() {  
        var hit;      
        let minX = 0;
        let maxX = this.game.world.bounds.width;
        let minY = 0;
        let maxY = this.game.world.bounds.height;
        Object.keys((<any>this.game.state).players).forEach(playerId => {
            const player = (<any>this.game.state).players[playerId];
            if (player.sprite.body.x < minX) minX = player.sprite.body.x;
            if (player.sprite.body.x > maxX) maxX = player.sprite.body.x;
            if (player.sprite.body.y < minY) minY = player.sprite.body.y;
            if (player.sprite.body.y > maxY) maxY = player.sprite.body.y;
            hit = this.game.physics.arcade.collide(player.sprite, this.platforms);
        });

        const medianX = maxX - minX;
        const medianY = maxY - minY;
        // this.game.camera.focusOnXY(medianX, this.game.world.centerY);

        if (this.cursor.left.isDown) {
            (<any>this.game.state).players[Object.keys((<any>this.game.state).players)[0]].sprite.body.velocity.x = -400;
        } else if (this.cursor.right.isDown) {
            (<any>this.game.state).players[Object.keys((<any>this.game.state).players)[0]].sprite.body.velocity.x = 400;
        } else {
            (<any>this.game.state).players[Object.keys((<any>this.game.state).players)[0]].sprite.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && (<any>this.game.state).players[Object.keys((<any>this.game.state).players)[0]].sprite.body.touching.down && hit) {
            (<any>this.game.state).players[Object.keys((<any>this.game.state).players)[0]].sprite.body.velocity.y = -300;
        }
    }

    shutdown() {}
}