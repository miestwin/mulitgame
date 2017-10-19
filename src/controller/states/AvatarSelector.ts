import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import Network from '../network';

/**
 * Wybór postaci
 * @export
 * @class AvatarSelector
 * @extends {Phaser.State}
 */
export class AvatarSelector extends Phaser.State {

    /**
     * Dostępne statki
     * @private
     * @type {Array<any>}
     * @memberof AvatarSelector
     */
    private ships: Array<any> = [
        { name: 'player-ship_green', color: 0x33cc33, use: false },
        { name: 'player-ship_purple', color: 0x9933ff, use: false },
        { name: 'player-ship_blue', color: 0x0066ff, use: false },
        { name: 'player-ship_yellow', color: 0xffff00, use: false },
        { name: 'player-ship_pink', color: 0xff3399, use: false },
        { name: 'player-ship_red', color: 0xff0000, use: false },
        { name: 'player-ship_gb', color: 0x009999, use: false },
        { name: 'player-ship_orange', color: 0xff6600, use: false },
        { name: 'player-ship_grass', color: 0x88cc00, use: false },
        { name: 'player-ship_darkpink', color: 0x993333, use: false }
    ];

    /**
     * Obszar wyboru awatara
     * @private
     * @type {Phaser.TileSprite}
     * @memberof AvatarSelector
     */
    private scrolingMap: Phaser.TileSprite;

    /**
     * Indeks w tablicy wybranego statku
     * @private
     * @type {number}
     * @memberof AvatarSelector
     */
    private selectedShipIndex: number;

    public preload() {
        Network.onUpdateAvatarSelector((res: string | Array<string>) => {
            if (res instanceof Array) {
                this.ships = this.ships.map(character => {
                    character.use = false;
                    if (~res.indexOf(character.name)) {
                        character.use = true;
                    }
                    return character;
                });
            } else {
                this.ships = this.ships.map(character => {
                    if (character.name == res) {
                        character.use = true;
                    }
                    return character;
                });
            }
        });

        Network.getAvatarsInUse();
    }

    public create() {
        var helloText = this.game.add.text(
            this.game.world.centerX, 30,
            'Choose your ship',
            { font: '25px Kenvector Future', fill: '#ffffff', align: 'center' });
        helloText.anchor.set(0.5, 0);
        
        this.scrolingMap = this.game.add.tileSprite(
            0, 80,
            this.game.width / 2 + this.ships.length * 140 + 30,
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

        for (var i = 0; i < this.ships.length; i++) {

            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x1f1f60);
            graphics.lineStyle(6, this.ships[i].color, 1);
            graphics.moveTo(40,50);
            graphics.lineTo(100, 75);
            graphics.lineTo(40, 100);
            graphics.lineTo(60, 75);
            graphics.lineTo(40, 50);
            graphics.endFill();

            const ship = this.game.add.sprite(
                this.game.world.centerX + i * 120,
                this.game.world.centerY - 60,
                graphics.generateTexture());
            // const ship = this.game.add.sprite(
            //     this.game.world.centerX + i * 120,
            //     this.game.world.centerY - 50,
            //     this.ships[i].name);
            ship.anchor.set(0.5, 1);
            //ship.scale.set(0.7);
            this.scrolingMap.addChild(ship);
            graphics.destroy();
        }

        this.scrolingMap.events.onDragStart.add(() => {
            (<any>this.scrolingMap).isBeingDraged = true;
            (<any>this.scrolingMap).movingSpeed = 0;
        }, this);

        this.scrolingMap.events.onDragStop.add(() => {
            (<any>this.scrolingMap).isBeingDraged = false;
        }, this);
        
        var button = this.game.add.button(this.game.world.centerX, this.game.height - 30, 'grey-button-04', this.actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 1);
        var buttonText = this.game.add.text(this.game.world.centerX, this.game.height - 35, 'Continue', { font: '20px Kenvector Future', fill: '#000000', align: 'center' });
        buttonText.anchor.set(0.5, 1);
    }

    update() {
        for (let _i = 0; _i < this.scrolingMap.children.length; _i++) {
            if (this.ships[_i].use) {
                this.scrolingMap.children[_i].alpha = 0.5;
            } else {
                this.scrolingMap.children[_i].alpha = 1;
            }
            if (this.scrolingMap.children[_i].worldPosition.x < this.game.world.centerX + 60
                && this.scrolingMap.children[_i].worldPosition.x > this.game.world.centerX - 60) {
                this.scrolingMap.getChildAt(_i).scale.set(1, 1);
                this.selectedShipIndex = _i;
            } else {
                this.scrolingMap.getChildAt(_i).scale.set(0.7, 0.7);
            }
        }
    }

    shutdown() {
        Network.removeListener(Network.UPDATE_CHARACTER_SELECTOR);
    }

    /**
     * Akcja wyboru avatara
     * @private
     * @memberof AvatarSelector
     */
    private actionOnClick() {
        if (!this.ships[this.selectedShipIndex].use) {
            Network.setPlayerAvatar(this.ships[this.selectedShipIndex].name);
            this.game.state.start(States.WAIT_FOR_GAME);
        }
    }
}