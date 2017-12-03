import 'p2';
import 'pixi';
import 'phaser';

import { Player } from './Player';
import { Assets } from '../assets';

export class Comet extends Phaser.Sprite {

    /**
     * Wytrzymałość komety
     * 
     * @type {number}
     * @memberof Comet
     */
    public health: number = 10;

    private lastPlayerCollision: Player;

    private explosion: Phaser.Sprite;
    
    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);
        game.add.existing(this);
        game.physics.arcade.enable(this);

        this.events.onKilled.add(() => {
            this.lastPlayerCollision = null;
            this.health = 10;
        }, this);

        this.explosion = this.game.add.sprite(this.x, this.y, Assets.Spritesheets.Explosions.Comet.getName());
        this.explosion.animations.add('explosion');
        this.explosion.alive = false;
        this.explosion.visible = false;
        this.explosion.exists = false;
        game.add.existing(this.explosion);
    }

    public playExplosion() {
        this.explosion.reset(this.x, this.y);
        this.explosion.animations.play('explosion', 30, false, true);
        this.explosion.body.velocity.x = this.body.velocity.x;
    }

    public checkLastCollision(player: Player) {
        if (this.lastPlayerCollision === player) {
            return true;
        }
        this.lastPlayerCollision = player;
        return false;
    }
}