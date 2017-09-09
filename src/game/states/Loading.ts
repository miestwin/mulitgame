import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';

import { States } from './States';
import config from '../../config';

export class Loading extends Phaser.State {

    private loadingSprite: Phaser.Sprite;
    private loadingText: Phaser.Text;

    preload() {
        this.game.stage.backgroundColor = '#000000';

        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        this.game.load.spritesheet('cat-dead', '../assets/spritesheets/characters/cat/dead/sprite.png', 556, 504, 10);
        this.game.load.spritesheet('cat-idle', '../assets/spritesheets/characters/cat/idle/sprite.png', 542, 473, 10);
        this.game.load.spritesheet('cat-jump', '../assets/spritesheets/characters/cat/jump/sprite.png', 542, 474, 8);
        this.game.load.spritesheet('cat-run', '../assets/spritesheets/characters/cat/run/sprite.png', 542, 473, 8);
        this.game.load.spritesheet('cat-walk', '../assets/spritesheets/characters/cat/walk/sprite.png', 542, 473, 10);

        this.game.load.spritesheet('dog-dead', '../assets/spritesheets/characters/dog/dead/sprite.png', 580, 510, 10);
        this.game.load.spritesheet('dog-idle', '../assets/spritesheets/characters/dog/idle/sprite.png', 547, 481, 10);
        this.game.load.spritesheet('dog-jump', '../assets/spritesheets/characters/dog/jump/sprite.png', 547, 481, 8);
        this.game.load.spritesheet('dog-run', '../assets/spritesheets/characters/dog/run/sprite.png', 547, 481, 8);
        this.game.load.spritesheet('dog-walk', '../assets/spritesheets/characters/dog/walk/sprite.png', 547, 481, 10);

        this.game.load.spritesheet('jack-dead', '../assets/spritesheets/characters/jack/dead/sprite.png', 986, 796, 10);
        this.game.load.spritesheet('jack-idle', '../assets/spritesheets/characters/jack/idle/sprite.png', 579, 763, 10);
        this.game.load.spritesheet('jack-jump', '../assets/spritesheets/characters/jack/jump/sprite.png', 579, 763, 10);
        this.game.load.spritesheet('jack-run', '../assets/spritesheets/characters/jack/run/sprite.png', 579, 763, 8);
        this.game.load.spritesheet('jack-walk', '../assets/spritesheets/characters/jack/walk/sprite.png', 579, 763, 10);

        this.game.load.spritesheet('ninja-dead', '../assets/spritesheets/characters/ninja/dead/sprite.png', 482, 498, 9);
        this.game.load.spritesheet('ninja-idle', '../assets/spritesheets/characters/ninja/idle/sprite.png', 232, 439, 9);
        this.game.load.spritesheet('ninja-jump', '../assets/spritesheets/characters/ninja/jump/sprite.png', 362, 483, 9);
        this.game.load.spritesheet('ninja-run', '../assets/spritesheets/characters/ninja/run/sprite.png', 363, 458, 9);
        this.game.load.spritesheet('ninja-walk', '../assets/spritesheets/characters/ninja/run/sprite.png', 363, 458, 9);

        this.game.load.spritesheet('robot-dead', '../assets/spritesheets/characters/robot/dead/sprite.png', 562, 519, 10);
        this.game.load.spritesheet('robot-idle', '../assets/spritesheets/characters/robot/idle/sprite.png', 567, 556, 10);
        this.game.load.spritesheet('robot-jump', '../assets/spritesheets/characters/robot/jump/sprite.png', 567, 556, 10);
        this.game.load.spritesheet('robot-run', '../assets/spritesheets/characters/robot/run/sprite.png', 567, 556, 8);
        this.game.load.spritesheet('robot-walk', '../assets/spritesheets/characters/robot/run/sprite.png', 567, 556, 8);
    }

    create() {
        // create qrcode and go to next state
        this.loadingText.setText('Create QRCode ...');
        this.createQRCode().then(() => {
            this.loadingText.setText('Create QRCode Complete');
            this.game.state.start(States.MAINMENU);
        });
    }

    private loadStart() {
        this.loadingSprite = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY - 50,
            'templerun');
        this.loadingSprite.anchor.set(0.5);
        this.loadingSprite.scale.set(0.2);
        this.loadingSprite.animations.add('run');
        this.loadingSprite.animations.play('run', 30, true);

        this.loadingText = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 50,
            'Loading ...',
            { 
                font: '25px Kenvector Future',
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

    private createQRCode () {
        let that = this;
        return new Promise((resolve, reject) => {
            let qr = new QRious({
                value: config.url + '/controller/' + (<any>this.game.state).id,
                background: '#ffffff',
                padding: 20,
                size: 300
            });
            qr = qr.toDataURL('image/jpeg');
            let img = new Image();
            img.onload = () => { 
                that.game.cache.addImage('qrcode', img.src, img); 
                resolve();
            };
            img.title = (<any>this.game.state).id;
            img.src = qr;
        });
    }
}