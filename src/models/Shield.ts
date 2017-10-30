import 'p2';
import 'pixi';
import 'phaser';

export class Shield extends Phaser.Sprite {

    private _playerId: string;

    public get playerId() {
        return this._playerId;
    }

    constructor(game: Phaser.Game, x: number, y: number, playerId: string) {
        super(game, x, y, 'shield');
        this._playerId = playerId;
        this.anchor.setTo(0.5);
        this.scale.setTo(0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    public setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}