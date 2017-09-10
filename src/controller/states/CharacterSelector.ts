import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import Network from '../network';

export class CharacterSelector extends Phaser.State {
    private characters: Array<any> = [
        { name: 'cat', use: false },
        { name: 'dog', use: false },
        { name: 'temple', use: false },
        { name: 'ninja', use: false },
        { name: 'robot', use: false }
    ];
    private scrolingMap: Phaser.TileSprite;
    private selectedCharacterIndex: number;

    public preload() {
        Network.updateCharacterSelector((res: string | Array<string>) => {
            if (res instanceof Array) {
                this.characters = this.characters.map(character => {
                    if (~res.indexOf(character.name)) {
                        character.use = true;
                    }
                    return character;
                });
            } else {
                this.characters = this.characters.map(character => {
                    if (character.name == res) {
                        character.use = true;
                    }
                    return character;
                });
            }
        });

        Network.getCharactersInUse();
    }

    public create() {
        var helloText = this.game.add.text(
            this.game.world.centerX, 50,
            'Select your character',
            { font: '25px Kenvector Future', fill: '#ffffff', align: 'center' });
        helloText.anchor.set(0.5, 0);
        
        this.scrolingMap = this.game.add.tileSprite(
            0, 80,
            this.game.width / 2 + this.characters.length * 130 + 70,
            this.game.height - 180,
            'transparent');
        this.scrolingMap.inputEnabled = true;
        this.scrolingMap.input.enableDrag(false);
        (<any>this.scrolingMap).savedPosition = new Phaser.Point(this.scrolingMap.x, this.scrolingMap.y);
        (<any>this.scrolingMap).isBeingDraged = false;
        (<any>this.scrolingMap).movingSpeed = 0;
        this.scrolingMap.input.allowVerticalDrag = false;
        this.scrolingMap.input.boundsRect = new Phaser.Rectangle(
            this.game.width - this.scrolingMap.width, 80,
            this.scrolingMap.width * 2 - this.game.width,
            this.game.height - 180);

        for (var i = 0; i < this.characters.length; i++) {
            const character = this.game.add.sprite(
                this.game.world.centerX + i * 100,
                this.game.world.centerY - 50,
                this.characters[i].name + '-idle');
            character.anchor.set(0.5, 1);
            character.scale.set(0.15);
            character.animations.add('idle');
            character.animations.play('idle', 15, true);
            this.scrolingMap.addChild(character);
        }

        this.scrolingMap.events.onDragStart.add(() => {
            (<any>this.scrolingMap).isBeingDraged = true;
            (<any>this.scrolingMap).movingSpeed = 0;
        }, this);

        this.scrolingMap.events.onDragStop.add(() => {
            (<any>this.scrolingMap).isBeingDraged = false;
        }, this);
        
        var button = this.game.add.button(this.game.world.centerX, this.game.height - 50, 'grey-button-04', this.actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 1);
        var buttonText = this.game.add.text(this.game.world.centerX, this.game.height - 55, 'Continue', { font: '20px Kenvector Future', fill: '#000000', align: 'center' });
        buttonText.anchor.set(0.5, 1);
    }

    update() {
        let zoomed: boolean = false;
        for (let _i = 0; _i < this.scrolingMap.children.length; _i++) {
            if (this.characters[_i].use) {
                this.scrolingMap.children[_i].alpha = 0.5;
            }
            if (this.scrolingMap.children[_i].worldPosition.x < this.game.world.centerX + 50
                && this.scrolingMap.children[_i].worldPosition.x > this.game.world.centerX - 50) {
                this.scrolingMap.getChildAt(_i).scale.set(0.20, 0.20);
                this.selectedCharacterIndex = _i;
            } else {
                this.scrolingMap.getChildAt(_i).scale.set(0.15, 0.15);
            }
        }
    }

    private actionOnClick() {
        if (!this.characters[this.selectedCharacterIndex].use) {
            Network.setPlayerCharacter(this.characters[this.selectedCharacterIndex].name);
            this.game.state.start(States.MESSAGE, true, false, 'Wait for game');
        }
    }
}