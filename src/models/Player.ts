import 'phaser';

export class Player {
    public id: string;
    public socketId: string;
    public character: string;
    public score: number;
    public position: Object;
    public sprite: Phaser.Sprite;

    constructor(player) {
        this.id = player.id;
        this.socketId = player.socketId;
        this.character = player.character;
        this.score = 0;
        this.position = {};
    }

    init() {
        
    }

    update() {

    }
}