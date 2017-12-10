import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import Network from '../network';
import { Assets } from '../../assets';

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
        { class: Assets.Images.Ships.GREEN, use: false },
        { class: Assets.Images.Ships.PURPLE, use: false },
        { class: Assets.Images.Ships.BLUE, use: false },
        { class: Assets.Images.Ships.WATERY, use: false },
        { class: Assets.Images.Ships.PINK, use: false },
        { class: Assets.Images.Ships.RED, use: false },
        { class: Assets.Images.Ships.YELLOW, use: false },
        { class: Assets.Images.Ships.ORANGE, use: false },
        { class: Assets.Images.Ships.GRASS, use: false },
        { class: Assets.Images.Ships.DARKPINK, use: false }
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
        this.game.stage.backgroundColor = '#000000';

        var helloText = this.game.add.text(
            this.game.world.centerX, 30,
            'Choose your ship',
            { font: `25px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#ffffff', align: 'center' });
        helloText.anchor.set(0.5, 0);
        
        this.scrolingMap = this.game.add.tileSprite(
            0, 80,
            this.game.width / 2 + this.ships.length * 140 + 30,
            this.game.height - 180,
            Assets.Images.Transparent.getName());
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
            const ship = this.game.add.sprite(
                this.game.world.centerX + i * 120,
                this.game.world.centerY - 60,
                this.ships[i].class.getName());
            ship.anchor.set(0.5, 1);
            ship.scale.setTo(0.3);
            this.scrolingMap.addChild(ship);
        }

        this.scrolingMap.events.onDragStart.add(() => {
            (<any>this.scrolingMap).isBeingDraged = true;
            (<any>this.scrolingMap).movingSpeed = 0;
        }, this);

        this.scrolingMap.events.onDragStop.add(() => {
            (<any>this.scrolingMap).isBeingDraged = false;
        }, this);
        
        var button = this.game.add.button(
            this.game.world.centerX,
            this.game.height - 30,
            Assets.UI.Buttons.Menu.Grey.getName(),
            this.actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 1);
        var buttonText = this.game.add.text(
            this.game.world.centerX,
            this.game.height - 35,
            'Continue',
            { font: `20px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#000000', align: 'center' });
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
                this.scrolingMap.getChildAt(_i).scale.set(0.6, 0.6);
                this.selectedShipIndex = _i;
            } else {
                this.scrolingMap.getChildAt(_i).scale.set(0.4, 0.4);
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
            Network.setPlayerAvatar(this.ships[this.selectedShipIndex].class.getName());
            (<any>this.game.state).shipClass = this.ships[this.selectedShipIndex].class;
            (<any>this.game.state).color = this.ships[this.selectedShipIndex].class.getValue();
            this.game.state.start(States.GAME_CONTROLLER);
        }
    }
}