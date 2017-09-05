import 'p2';
import 'pixi';
import 'phaser';

export class Loading extends Phaser.State {

    private loadingSprite: Phaser.Sprite;
    private loadingText: Phaser.Text;

    preload() {
        this.game.stage.backgroundColor = '#000000';

        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        this.game.load.spritesheet('cat-idle', '../assets/spritesheets/characters/cat/idle/sprite.png', 542, 473, 10);
        this.game.load.spritesheet('dog-idle', '../assets/spritesheets/characters/dog/idle/sprite.png', 547, 481, 10);
        this.game.load.spritesheet('jack-idle', '../assets/spritesheets/characters/jack/idle/sprite.png', 579, 763, 10);
        this.game.load.spritesheet('ninja-idle', '../assets/spritesheets/characters/ninja/idle/sprite.png', 232, 439, 9);
        this.game.load.spritesheet('robot-idle', '../assets/spritesheets/characters/robot/idle/sprite.png', 567, 556, 10);

        this.game.load.image('grey-button-04', '../assets/spritesheets/gui/ui/PNG/grey_button04.png');
    }

    create() {
        this.game.state.start('MainMenu');
    }

    private loadStart() {
        this.loadingSprite = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY - 25,
            'templerun');
        this.loadingSprite.anchor.set(0.5);
        this.loadingSprite.scale.set(0.15);
        this.loadingSprite.animations.add('run');
        this.loadingSprite.animations.play('run', 30, true);

        this.loadingText = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 25,
            'Loading ...',
            { 
                font: '20px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        this.loadingText.anchor.set(0.5);
    }

    private fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        this.loadingText.setText(`Loading ${progress}%`);
    }

    private loadComplete() {
        this.loadingText.setText('Load Complete');
    }
}