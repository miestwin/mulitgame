import 'p2';
import 'pixi';
import 'phaser';

import { generatePoints, convexhull, randomNumberInRange } from '../utils';

const colors = [0xffffff, 0xccccff, 0xccffff, 0xb3ffb3, 0xffff99, 0xffb3ff, 0x99ccff];

export class Asteroid extends Phaser.Sprite {

    private points: Array<any>;
    private color;
    private timer: Phaser.Timer;

    constructor(game: Phaser.Game, x: number, y: number) {
        const points = convexhull(generatePoints(x, y, 20));
        points.push(points[0]);
        const color = colors[randomNumberInRange(0, 6)];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(color);
        graphics.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            graphics.lineTo(point[0], point[1]);
        }
        graphics.endFill();
        super(game, x, y, graphics.generateTexture());
        graphics.destroy();
        this.points = points;
        this.color = color;
        this.anchor.setTo(0.5);
        //game.add.existing(this);
        //game.physics.arcade.enable(this);
        // this.body.collideWorldBounds = true;
    
        // var filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('glow'));
        // this.filters = [filter];
    }
}