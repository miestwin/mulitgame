import 'phaser';

export class Player extends Phaser.Sprite {
    public id: string;
    public socketId: string;
    public score: number;
    public position: any;

    constructor(game: Phaser.Game, id, socketId, character) {
        super(game, 0, 0, character);
    }

    update() {

    }
}