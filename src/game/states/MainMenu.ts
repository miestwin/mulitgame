import 'p2';
import 'pixi';
import 'phaser';
import  * as _ from 'lodash';

import { States } from './States';
import Network from '../network';

import { Player } from '../../models';

export class MainMenu extends Phaser.State {
    private messages: Array<Phaser.Text> = [];

    public preload() {
        this.game.stage.backgroundColor = '#000000';
        (<any>this.game.state).players = {};

        Network.updatePlayersState((player) => {
            
            // update players state
            if (!(<any>this.game.state).players[player.id]) {
                (<any>this.game.state).players[player.id] = new Player(player);
                (<any>this.game.state).players[player.id].init(this.game, -100, 540);
                (<any>this.game.state).players[player.id].idle();
            } 

            // remove all messages
            this.messages.forEach((text) => {
                text.destroy()
            });
            this.messages.length = 0;
            
            // show players idle
            Object.keys((<any>this.game.state).players).forEach((playerId, index, playersId) => {
                const count = playersId.length;
                const step = this.game.world.centerX / count;
                const offset = step / 2;
                const x = step * (index + 1) + (offset * (count - 1));
                (<any>this.game.state).players[playerId].setX(x);
                const text = this.game.add.text(x, 555, 
                    `Player ${index + 1}\nconnected`, 
                    { 
                        font: '11px Kenvector Future',
                        fill: '#ffffff',
                        align: 'center'
                    });
                text.anchor.set(0.5, 0);
                this.messages.push(text);
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