import 'p2';
import 'pixi';
import 'phaser';
import  * as _ from 'lodash';

import { States } from './States';
import Network from '../network';

import { Player } from '../../models';

export class MainMenu extends Phaser.State {

    public preload() {
        this.game.stage.backgroundColor = '#000000';
        (<any>this.game.state).players = {};

        Network.updatePlayersState((players) => {
            (<any>this.game.state).players = {};
            players.forEach((player) => {
                (<any>this.game.state).players[player.id] = new Player(this.game, player.id, player.socketID, player.character);
            });
        });

        Network.playerDisconnected((player) => {
            
        });
    }

    public create() {
        // show game title
        const text = this.game.add.text(
            this.game.world.centerX, 40,
            'SUPER GAME TITLE',
            { 
                font: '35px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        text.anchor.set(0.5, 0);

        // show qrcode
        const qr = this.game.add.sprite(this.game.world.centerX, 100, 'qrcode');
        qr.anchor.set(0.5, 0);
        // show game id
        var gameIdText = this.game.add.text(this.game.world.centerX, 405,
            (<any>this.game.state).id,
            { 
                font: '15px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        gameIdText.anchor.set(0.5, 0);
    }

    shutdown() {
        Network.removeListener(Network.UPDATE_PLAYERS_STATE);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
    }
}