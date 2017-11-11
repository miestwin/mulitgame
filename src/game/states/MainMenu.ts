import 'p2';
import 'pixi';
import 'phaser';
// import * as screenfull from 'screenfull';

import { States } from './States';
import Network from '../network';
import { Assets } from '../../assets';
import { Player } from '../../models';

/**
 * Menu główne
 * @export
 * @class MainMenu
 * @extends {Phaser.State}
 */
export class MainMenu extends Phaser.State {

    /**
     * Tablica wiadomości o połączonychgraczach
     * @private
     * @type {Array<Phaser.Text>}
     * @memberof MainMenu
     */
    private messages: Array<Phaser.Text> = [];

    /**
     * Wiadomość informująca kiedy zacznie się gra
     * @private
     * @type {Phaser.Text}
     * @memberof MainMenu
     */
    private timer: Phaser.Text;

    public preload() {
        this.game.stage.backgroundColor = '#000000';
        (<any>this.game.state).players = {};

        Network.onUpdatePlayersState((player) => {
            // update players state
            if (!(<any>this.game.state).players[player.id]) {
                (<any>this.game.state).players[player.id] = 
                    new Player(this.game, -100, 540, { id: player.id, socketId: player.socketID, avatar: player.character });
                (<any>this.game.state).players[player.id].anchor.setTo(0.5, 1);
                (<any>this.game.state).players[player.id].scale.setTo(0.7);
            } 
            this.showConnected();
        });

        Network.onPlayerDisconnected((player) => {
            // remove player
            (<any>this.game.state).players = Object.keys((<any>this.game.state).players).reduce((players, nextId) => {
                if ((<any>this.game.state).players[nextId].id == player.id) {
                    (<any>this.game.state).players[nextId].destroy();
                    return players;
                }
                players[nextId] = (<any>this.game.state).players[nextId];
                return players;
            }, {});
            this.showConnected();
        });

        Network.onUpdateTimer((sec) => {
            this.timer.setText('The game will start in ' + sec);
        });

        Network.onStartGame(() => {
            if (Object.keys((<any>this.game.state).players).length < 1) {
                const message = 'No connected players';
                const text = 'Try again';
                const action = () => this.game.state.start(States.MAIN_MENU);
                this.game.state.start(States.MESSAGE, true, false, message, text, action);
            } else {
                (<any>this.game.state).players = {};
                (<any>this.game.state).started = true;
                // if (screenfull.enabled) {
                //     screenfull.request();
                // }
                this.game.state.start(States.START_GAME);
            }
        });

        Network.startTimer();
    }

    public create() {
        // const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('glow'));
        const starsback = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
        starsback.autoScroll(-100, 0);
        const nebulaback = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'nebula-1');
        nebulaback.autoScroll(-200, 0);
        // const nebulaback2 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'nebula-2');
        // nebulaback2.autoScroll(-200, 0);
        // back.filters = [filter];

        // show game title
        const title = this.game.add.text(
            this.game.world.centerX, 40,
            'SUPER GAME TITLE',
            { 
                font: `35px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        title.anchor.set(0.5, 0);

        // show qrcode
        const qr = this.game.add.sprite(this.game.world.centerX, 100, 'qrcode');
        qr.anchor.set(0.5, 0);
        // show game id
        var gameIdText = this.game.add.text(this.game.world.centerX, 405,
            (<any>this.game.state).id,
            { 
                font: `15px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        gameIdText.anchor.set(0.5, 0);

        this.timer = this.game.add.text(
            this.game.world.centerX, 440, 'The game will start in ...',
            {
                font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        this.timer.anchor.set(0.5, 0);
    }

    shutdown() {
        Network.removeListener(Network.UPDATE_PLAYERS_STATE);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
        Network.removeListener(Network.UPDATE_TIMER);
        Network.removeListener(Network.START_GAME);
    }

    private showConnected() {
        // remove all messages
        this.messages.forEach((text) => {
            text.destroy();
        });
        this.messages.length = 0;
            
        // show players idle
        Object.keys((<any>this.game.state).players).forEach((playerId, index, playersId) => {
            const count = playersId.length;
            const step = this.game.world.centerX / count;
            const offset = step / 2;
            const x = step * (index + 1) + (offset * (count - 1));
            (<any>this.game.state).players[playerId].x = x;
            const text = this.game.add.text(x, 555, 
                `Player ${index + 1}\nconnected`, 
                { 
                    font: `11px ${Assets.Fonts.Kenvector.getFamily()}`,
                    fill: '#ffffff',
                    align: 'center'
                });
            text.anchor.set(0.5, 0);
            this.messages.push(text);
        });
    }
}